<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { api } from '~/services/api';
import { useAuth } from '~/composables/useState';
import { useCheckoutState } from '~/composables/useCheckout';

import DashboardLoadingSpinner from '~/components/LoadingSpinner.vue';

// Mendefinisikan layout default
definePageMeta({
  layout: 'default',
});

// --- STATE MANAGEMENT ---
const auth = useAuth();
const checkoutState = useCheckoutState(); // State untuk menyimpan invoice pending
const router = useRouter();

// --- LOCAL STATE ---
const packageDetails = ref(null); // Detail paket dari API
const discountCode = ref('');
const isLoading = ref(false); // Untuk status loading tombol
const errorMessage = ref('');
const timer = ref(1800); // 30 menit dalam detik
let timerInterval = null;

// --- COMPUTED PROPERTIES ---
// Properti ini menjadi penentu utama untuk menampilkan Step 1 atau Step 2
const isStep2 = computed(() => !!checkoutState.value);

// Menghitung harga setelah diskon (saat ini diskon masih 0)
const priceAfterDiscount = computed(() => {
  const price = packageDetails.value?.price || 0;
  // Logika diskon bisa ditambahkan di sini jika diperlukan
  return price;
});

const formattedTimer = computed(() => {
  if (timer.value <= 0) return '00:00:00';
  const hours = Math.floor(timer.value / 3600);
  const minutes = Math.floor((timer.value % 3600) / 60);
  const seconds = timer.value % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

// --- HELPER FUNCTIONS ---
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

const formatDateShort = (date) => new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(date);
const formatTime = (date) => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(date).toLowerCase();

// --- TIMER LOGIC ---
const startTimer = () => {
  if (!checkoutState.value || !checkoutState.value.expiryDate) return;

  const now = new Date();
  const expiry = new Date(checkoutState.value.expiryDate);
  const diffSeconds = Math.floor((expiry - now) / 1000);

  if (diffSeconds <= 0) {
    timer.value = 0;
    // Jika waktu habis, reset state agar kembali ke Step 1
    checkoutState.value = null;
    return;
  }
  
  timer.value = diffSeconds;

  timerInterval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    } else {
      clearInterval(timerInterval);
      // Reset state saat timer habis
      checkoutState.value = null;
    }
  }, 1000);
};

// --- API & ACTIONS ---
const handlePayment = async () => {
  if (!auth.value.user?.id || !packageDetails.value) {
    errorMessage.value = 'Data pengguna atau paket tidak ditemukan. Silakan coba lagi.';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  const now = new Date();
  const endDate = new Date(now);
  endDate.setMonth(now.getMonth() + 1); // Durasi 1 bulan

  const payload = {
    product_membership_id: packageDetails.value.id,
    user_id: auth.value.user.id,
    subscription_type: 'monthly',
    duration: '1',
    start_at: now.toISOString().slice(0, 19).replace('T', ' '),
    end_at: endDate.toISOString().slice(0, 19).replace('T', ' '),
    redirect_url: window.location.href, // URL kembali setelah pembayaran
  };

  try {
    const response = await api.orderPackage(payload);
    console.log('Order berhasil dibuat:', response);

    if (response.data?.latest_invoice?.[0] && response.data.payment_url) {
      const invoice = response.data.latest_invoice[0];
      
      // Simpan data penting ke state checkout
      checkoutState.value = {
        totalAmount: invoice.amount,
        paymentUrl: response.data.payment_url, // **PENTING**: Asumsi API mengembalikan ini
        expiryDate: invoice.due_date,
      };

      // Alihkan pengguna ke halaman pembayaran
      window.location.href = response.data.payment_url;
    } else {
      throw new Error('Respons API tidak valid atau tidak berisi URL pembayaran.');
    }
  } catch (error) {
    console.error('Gagal membuat pesanan:', error);
    errorMessage.value = error.message || 'Terjadi kesalahan saat memproses pesanan Anda.';
  } finally {
    isLoading.value = false;
  }
};

const handleChoosePaymentMethod = () => {
  if (checkoutState.value?.paymentUrl) {
    window.location.href = checkoutState.value.paymentUrl;
  } else {
    alert('URL Pembayaran tidak ditemukan. Silakan batalkan dan coba lagi.');
  }
};

const cancelOrder = () => {
  checkoutState.value = null; // Menghapus state akan mengembalikan ke Step 1
  if (timerInterval) clearInterval(timerInterval);
};

// --- LIFECYCLE HOOKS ---
onMounted(async () => {
  if (isStep2.value) {
    startTimer();
  } else {
    // Jika bukan Step 2, ambil detail paket untuk ditampilkan di Step 1
    isLoading.value = true;
    try {
      const response = await api.getMembershipPackage(1); // Ambil detail paket ID 1
      packageDetails.value = response.data;
    } catch (error) {
      errorMessage.value = 'Gagal memuat detail paket.';
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  }
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<template>
  <div class="bg-gray-50 min-h-screen py-8 font-sans">
    <div class="container mx-auto max-w-lg px-4">

      <div v-if="isStep2" class="flex flex-col h-full">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-xl font-bold text-gray-800">Terakhir Bayar</h1>
          <p class="text-xl font-bold text-red-500">{{ formattedTimer }}</p>
        </div>

        <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Rincian Pembelian</h2>
          <div class="space-y-3 text-sm text-gray-600">
            <div class="flex justify-between">
              <p>Harga Paket</p>
              <p>{{ formatCurrency(checkoutState.totalAmount) }}</p>
            </div>
            <div class="flex justify-between">
              <p>Diskon</p>
              <p>0%</p>
            </div>
          </div>
          <hr class="my-4"/>
          <div class="flex justify-between items-center">
            <p class="text-base font-bold text-gray-900">Total Harga</p>
            <p class="text-lg font-bold text-gray-900">{{ formatCurrency(checkoutState.totalAmount) }}</p>
          </div>
        </div>

        <div class="bg-white border border-gray-200 rounded-xl flex items-center p-4 shadow-sm">
          <div class="bg-blue-100 p-3 rounded-full mr-4">
            <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M21.928 10.609c.074.332.115.674.115 1.026C22.043 12.015 22 12.44 22 13c0 4.97-4.03 9-9 9-4.971 0-9-4.03-9-9 0-4.971 4.029-9 9-9h.215c.032.002.065.003.097.006A8.994 8.994 0 0113 4c4.97 0 9 4.03 9 9 0 .56-.043.985-.115 1.391L21.928 10.609zM13 2c-5.839 0-10.748 4.484-10.992 10.198C1.869 17.576 6.012 22 11.05 22c4.97 0 9-4.03 9-9 0-.62-.05-1.228-.147-1.823L19.928 7.39c.074.332.115.674.115 1.026.001.38-.039.754-.114 1.12L20 10c0 4.411-3.589 8-8 8-4.412 0-8-3.589-8-8s3.588-8 8-8h.215a8.973 8.973 0 010 .006A8.994 8.994 0 0113 2z"/></svg>
          </div>
          <div class="flex-grow">
            <h3 class="font-semibold text-gray-800">Metode pembayaran</h3>
            <p class="text-sm text-gray-500">Transfer, e-wallet, QRIS</p>
          </div>
          <button @click="handleChoosePaymentMethod" class="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg text-sm hover:bg-blue-600 transition-colors">
            Pilih
          </button>
        </div>

        <div class="mt-auto pt-8 text-center">
            <button @click="cancelOrder" class="text-red-500 font-bold">
              Batalkan Pesanan
            </button>
        </div>
      </div>

      <div v-else>
        <div v-if="isLoading && !packageDetails" class="text-center py-10">
          <DashboardLoadingSpinner />
        </div>
        <div v-else-if="errorMessage" class="text-center py-10 text-red-500">
          <p>{{ errorMessage }}</p>
        </div>
        <div v-else-if="packageDetails">
            <div class="bg-gradient-to-br from-blue-300 via-blue-400 to-cyan-400 text-white p-5 rounded-2xl shadow-lg mb-6">
              <p class="text-sm font-light text-blue-900">Detail Orders</p>
              <h1 class="text-2xl font-bold text-gray-900 mt-1 mb-4">{{ packageDetails.name }}</h1>
              
              <div class="flex justify-between items-center">
                <div class="text-center">
                  <p class="font-semibold text-gray-800">{{ formatDateShort(new Date()) }}</p>
                  <p class="text-xs text-gray-700">{{ formatTime(new Date()) }}</p>
                </div>
                
                <div class="relative">
                  <div class="bg-white/80 backdrop-blur-sm border-2 border-white/50 rounded-full px-4 py-2 flex items-center gap-2 shadow-inner">
                      <span class="font-bold text-blue-500">Paket</span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span class="font-bold text-blue-500">Konek</span>
                  </div>
                  <span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    1 Bulan
                  </span>
                </div>

                <div class="text-center">
                  <p class="font-semibold text-gray-800">{{ formatDateShort(new Date(new Date().setMonth(new Date().getMonth() + 1))) }}</p>
                  <p class="text-xs text-gray-700">{{ formatTime(new Date()) }}</p>
                </div>
              </div>
            </div>

            <div class="bg-white border border-gray-200 rounded-xl flex items-center p-3 mb-6 shadow-sm">
              <div class="bg-blue-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <label for="discount-code" class="text-gray-700 font-semibold whitespace-nowrap">Masukan Kode Diskon</label>
              <input 
                id="discount-code"
                v-model="discountCode" 
                type="text" 
                placeholder="Masukkan Kode"
                class="w-full text-right bg-transparent border-none focus:ring-0 placeholder-gray-400"
              />
            </div>

            <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 class="text-lg font-bold text-gray-800 mb-4">Rincian Pembelian</h2>
              <div class="space-y-3 text-sm text-gray-600">
                <div class="flex justify-between">
                  <p>Harga Paket</p>
                  <p>{{ formatCurrency(packageDetails.price) }}</p>
                </div>
                <div class="flex justify-between">
                  <p>Diskon</p>
                  <p>0%</p>
                </div>
              </div>
              <hr class="my-4"/>
              <div class="flex justify-between items-center">
                <p class="text-base font-bold text-gray-900">Total Harga</p>
                <p class="text-lg font-bold text-gray-900">{{ formatCurrency(priceAfterDiscount) }}</p>
              </div>
            </div>

            <div class="mt-8">
              <div class="flex items-center gap-4">
                <button @click="router.back()" class="text-red-500 font-bold px-6 py-3">
                  Batalkan
                </button>
                <button 
                  @click="handlePayment"
                  :disabled="isLoading"
                  class="flex-grow bg-blue-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-blue-600 active:scale-95 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  <div v-if="isLoading" class="w-5 h-5">
                    <DashboardLoadingSpinner />
                  </div>
                  <span v-else>Pembayaran</span>
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>