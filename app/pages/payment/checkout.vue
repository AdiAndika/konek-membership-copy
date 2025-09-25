<script setup>
import { ref, computed } from 'vue';

// Menggunakan layout default (dengan Navbar dan Footer)
definePageMeta({
  layout: 'default',
});

// --- DATA ---
// NOTE: Di aplikasi nyata, data ini akan datang dari API atau state management.
// Untuk sekarang, kita gunakan data tiruan.
const orderDetails = ref({
  productName: 'Paket Konek Entertainment',
  startDate: new Date('2025-11-10T23:25:00'),
  durationMonths: 1,
  price: 99000,
  discount: 0, // dalam persen
});

const discountCode = ref('');

// --- COMPUTED PROPERTIES ---
// Properti komputasi untuk memformat data agar mudah ditampilkan di template.
const priceAfterDiscount = computed(() => {
  return orderDetails.value.price * (1 - orderDetails.value.discount / 100);
});

const endDate = computed(() => {
  const date = new Date(orderDetails.value.startDate);
  date.setMonth(date.getMonth() + orderDetails.value.durationMonths);
  return date;
});

// Fungsi untuk memformat angka menjadi format mata uang Rupiah
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
  }).format(value).replace('Rp', 'Rp.');
};

// Fungsi untuk memformat tanggal menjadi "10 Nov"
const formatDateShort = (date) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
  }).format(date);
};

// Fungsi untuk memformat waktu menjadi "11:25 pm"
const formatTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date).toLowerCase();
};


// --- METHODS ---
// NOTE: Ini adalah placeholder untuk logika pembayaran.
const proceedToPayment = () => {
  console.log('Menuju ke pembayaran...');
  alert('Logika untuk proses pembayaran akan diimplementasikan di sini.');
  // Di sini Anda akan menavigasi ke gateway pembayaran atau memanggil API pembayaran.
};
</script>

<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="container mx-auto max-w-sm px-4">
      
      <div class="bg-gradient-to-br from-blue-300 via-blue-400 to-cyan-400 text-white p-5 rounded-2xl shadow-lg mb-6">
        <p class="text-sm font-light text-blue-900">Detail Orders</p>
        <h1 class="text-2xl font-bold text-gray-900 mt-1 mb-4">{{ orderDetails.productName }}</h1>
        
        <div class="flex justify-between items-center">
          <div class="text-center">
            <p class="font-semibold text-gray-800">{{ formatDateShort(orderDetails.startDate) }}</p>
            <p class="text-xs text-gray-700">{{ formatTime(orderDetails.startDate) }}</p>
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
              {{ orderDetails.durationMonths }} Bulan
            </span>
          </div>

          <div class="text-center">
            <p class="font-semibold text-gray-800">{{ formatDateShort(endDate) }}</p>
            <p class="text-xs text-gray-700">{{ formatTime(endDate) }}</p>
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
            <p>{{ formatCurrency(orderDetails.price) }}</p>
          </div>
          <div class="flex justify-between">
            <p>Diskon</p>
            <p>{{ orderDetails.discount }}%</p>
          </div>
          <div class="flex justify-between">
            <p>Setelah Mendapatkan Diskon<br>& Penawaran Lainnya</p>
            <p class="text-right">{{ formatCurrency(priceAfterDiscount) }}</p>
          </div>
        </div>
        <hr class="my-4"/>
        <div class="flex justify-between items-center">
          <p class="text-base font-bold text-gray-900">Total Harga</p>
          <p class="text-lg font-bold text-gray-900">{{ formatCurrency(priceAfterDiscount) }}</p>
        </div>
      </div>

      <div class="mt-8">
        <button 
          @click="proceedToPayment"
          class="w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-blue-600 active:scale-95 transition-all duration-200"
        >
          Pembayaran
        </button>
      </div>

    </div>
  </div>
</template>