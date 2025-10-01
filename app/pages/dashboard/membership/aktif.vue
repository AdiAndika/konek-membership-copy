<script setup>
import { ref, computed, onMounted } from 'vue';
import { accountImages, accountsData } from '~/data/accounts.js'; 
import AccountModal from '~/components/AccountModal.vue';
import { api } from '~/services/api';
import { useAuth } from '~/composables/useState';

const auth = useAuth();

// --- PERUBAHAN UTAMA DI SINI ---
// Langsung ambil nama lengkap dari state cookie.
// Jika tidak ada, baru gunakan 'Pengguna' sebagai fallback.
const userFullName = ref(auth.value.user?.full_name || 'Pengguna'); 

const expiryDate = ref(null);
const membershipAccounts = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  if (auth.value.user && auth.value.user.id) {
    try {
      isLoading.value = true;
      // Panggilan API untuk user detail tidak diperlukan lagi untuk nama,
      // tapi kita tetap ambil data membership.
      const membershipResponse = await api.getMembershipDetail(auth.value.user.id);

      if (membershipResponse.data) {
        expiryDate.value = new Date(membershipResponse.data.end_at);
        membershipAccounts.value = membershipResponse.data.pelanggan_membership_akun || [];
      }
    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
    } finally {
      isLoading.value = false;
    }
  } else {
    isLoading.value = false;
  }
});

// --- Sisa dari script tidak perlu diubah ---

const idata = computed(() => {
  const allPossibleProducts = Object.keys(accountsData);

  return allPossibleProducts.map(productName => {
    const ownedAccount = membershipAccounts.value.find(
      acc => acc.account_product?.paket_addon?.name === productName
    );

    if (ownedAccount) {
      const staticData = accountsData[productName];
      return {
        title: productName,
        image: accountImages[productName] || '/images/default.png',
        isOwned: true,
        apiData: {
          owned: true,
          product: productName,
          email: ownedAccount.account_product?.email,
          password: ownedAccount.account_product?.password,
          profileName: ownedAccount.account_profile?.name, // Koreksi: Mengambil nama profil
          pin: ownedAccount.pin,
          tutorial: staticData.tutorial,
          terms: staticData.terms,
          consequences: staticData.consequences,
        }
      };
    } else {
      return {
        title: productName,
        image: accountImages[productName] || '/images/default.png',
        isOwned: false,
        apiData: {
          owned: false,
          product: productName,
        }
      };
    }
  });
});

const daysRemaining = computed(() => {
  if (!expiryDate.value) return 0;
  const now = new Date();
  const expiry = new Date(expiryDate.value);
  const diffTime = expiry - now;
  if (diffTime < 0) return 0;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

const formattedExpiryDate = computed(() => {
  if (!expiryDate.value) return 'Tidak Aktif';
  return new Date(expiryDate.value).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
});

const progressPercentage = computed(() => {
  if (daysRemaining.value <= 0) return 0;
  return Math.min(100, Math.max(0, (daysRemaining.value / 30) * 100));
});

const progressStyle = computed(() => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progressPercentage.value / 100) * circumference;
  return {
    strokeDasharray: circumference,
    strokeDashoffset: offset
  };
});

const isModalOpen = ref(false);
const selectedAccount = ref(null);

const openAccountModal = (item) => {
  if (item && item.apiData) {
    selectedAccount.value = item.apiData;
    isModalOpen.value = true;
  } else {
    console.warn(`Data akun tidak lengkap.`);
  }
};

const closeAccountModal = () => {
  isModalOpen.value = false;
};
</script>


<template>
  <div style="background: linear-gradient(180deg, #0080ff 0%, #fff 25%)">
    <div class="container mx-auto px-4 lg:px-8 py-8">
      <div class="lg:flex lg:gap-8 xl:gap-12">
  
        <aside class="lg:w-1/3 xl:w-1/4 mb-8 lg:mb-0">
          <div class="rounded-2xl bg-white w-full max-w-sm mx-auto shadow-xl p-6 text-center sticky top-8">
            <p class="text-gray-600">Selamat Datang 👋</p>
            <h1 class="text-2xl font-bold text-gray-900 truncate">{{ userFullName }}</h1>
            <div class="relative w-48 h-48 mx-auto my-4">
              <svg class="w-full h-full" viewBox="0 0 120 120">
                <circle class="text-gray-200" stroke-width="10" stroke="currentColor" fill="transparent" r="52" cx="60" cy="60" />
                <circle 
                  class="text-cyan-500" 
                  stroke-width="11" 
                  :style="progressStyle"
                  stroke-linecap="round" 
                  stroke="currentColor" 
                  fill="transparent" 
                  r="52" 
                  cx="60" 
                  cy="60"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-5xl font-extrabold text-gray-800">{{ daysRemaining }}</span>
                <span class="text-sm font-semibold text-gray-500">Hari Aktif</span>
              </div>
            </div>
            <h2 class="text-lg font-semibold text-gray-800">{{ formattedExpiryDate }}</h2>
            <div class="flex justify-center items-center gap-2 text-sm text-gray-600 mt-1">
              <img class="w-4 h-4" src="~/assets/images/calender.png" alt="Kalender" />
              <span>Masa Aktif</span>
            </div>
          </div>
        </aside>
  
        <main class="lg:w-2/3 xl:w-3/4">
          <section class="mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 lg:text-gray-50 mb-4">
              Produk Digital
            </h2>
            <div v-if="isLoading" class="text-center text-white p-4">Memuat data produk...</div>
            <div v-else class="divide-y divide-gray-200 bg-white p-4 rounded-xl shadow-sm">
              <div v-for="(item, index) in idata" :key="index" class="flex justify-between items-center py-3">
                <img :src="item.image" :alt="item.title" class="w-24 h-24 object-contain" />
                <button @click="openAccountModal(item)" class="text-[#0080FF] font-semibold hover:underline">
                  Lihat akun
                </button>
              </div>
            </div>
          </section>
  
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <section>
              <div class="flex justify-between items-center mb-4">
                <h1 class="text-2xl md:text-3xl font-semibold text-gray-900">
                  Histori Pembelian
                </h1>
                <p class="text-[#0080FF] font-semibold cursor-pointer">Lihat Semua</p>
              </div>
              <div class="space-y-4">
                <div class="bg-gradient-to-r from-[#E3F0FF] to-[#DFF5FF] rounded-xl shadow-md p-4">
                  <div class="flex justify-between items-start mb-3">
                    <div class="flex items-start gap-4">
                      <img src="~/assets/images/logo-konek-biru.png" alt="Konek Market" class="w-16 h-auto" />
                      <div>
                        <p class="text-base font-medium mb-2">Konek Entertainment</p>
                        <div class="text-xs text-gray-800 space-y-1">
                          <p>ID: <span class="font-medium">KNX-20250828-ABC123</span></p>
                          <p>Tanggal: <span class="font-medium">27 Sep 2025</span></p>
                        </div>
                      </div>
                    </div>
                    <button class="bg-gradient-to-r from-[#0080FF] to-[#4DC9E6] text-white text-xs px-3 py-1 rounded-md font-medium">
                      Detail
                    </button>
                  </div>
                  <div class="flex justify-between items-center mt-4">
                    <p class="text-lg font-bold">Rp.99.000</p>
                    <p class="text-green-600 font-bold text-sm">BERHASIL</p>
                  </div>
                </div>
              </div>
            </section>
            <section>
               <div class="bg-white rounded-xl shadow-sm p-6 h-full">
                <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
                  Hubungi Kami
                </h1>
                <h2 class="text-base font-medium text-gray-900 mb-2">
                  Jam Operasional
                </h2>
                <div class="space-y-2 text-sm mb-4">
                  <div class="flex justify-between items-center">
                    <h3 class="text-gray-600">Senin - Jumat :</h3>
                    <p class="font-semibold text-gray-800">09.00 - 17.00 WITA</p>
                  </div>
                  <div class="flex justify-between items-center">
                    <h3 class="text-gray-600">Sabtu :</h3>
                    <p class="font-semibold text-gray-800">09.00 - 17.00 WITA</p>
                  </div>
                  <div class="flex justify-between items-center">
                    <h3 class="text-gray-600">Minggu & Tgl Merah :</h3>
                    <p class="text-red-500 font-semibold">Libur</p>
                  </div>
                </div>
                <a href="#" class="flex items-center justify-between border rounded-xl px-4 py-3 shadow-sm bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div class="flex items-center space-x-3">
                    <img src="~/assets/images/wa.png" alt="WhatsApp" class="w-6 h-6" />
                    <span class="text-[#111827] font-semibold">Admin Konek Plus</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-gray-500">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      leave-active-class="transition-opacity duration-200 ease-in"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-end justify-center">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeAccountModal"></div>
        <Transition
          appear
          enter-active-class="transition-transform duration-300 ease-out"
          leave-active-class="transition-transform duration-200 ease-in"
          enter-from-class="translate-y-full"
          enter-to-class="translate-y-0"
          leave-from-class="translate-y-0"
          leave-to-class="translate-y-full"
        >
          <AccountModal
            v-if="selectedAccount"
            :account="selectedAccount"
            @close="closeAccountModal"
          />
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap");
</style>