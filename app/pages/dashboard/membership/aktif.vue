<script setup>
import { ref } from 'vue';
import { accountsData } from '~/data/accounts.js';
import AccountModal from '~/components/AccountModal.vue';

const idata = [
  { title: "Netflix", image: "/images/netflix.png" },
  { title: "Spotify", image: "/images/spotify.png" },
  { title: "VIU", image: "/images/viu_full.png" },
  { title: "ChatGPT", image: "/images/chatgpt.png" },
  { title: "WeTV", image: "/images/wetv.png" },
];

const isModalOpen = ref(false);
const selectedAccount = ref(null);

const openAccountModal = (productTitle) => {
  const accountInfo = accountsData[productTitle];
  if (accountInfo) {
    selectedAccount.value = accountInfo;
    isModalOpen.value = true;
  } else {
    console.warn(`Data akun untuk "${productTitle}" tidak ditemukan.`);
  }
};

const closeAccountModal = () => {
  isModalOpen.value = false;
};
</script>

<template>
  <section
    style="background: linear-gradient(180deg, #0080ff 0%, #fff 61.07%)"
    class="flex flex-col items-center justify-center p-4 py-8"
  >
    <div class="rounded-[24px] bg-white w-full lg:w-[500px] shadow-[0_4px_15px_0_rgba(0,0,0,0.25)] p-4">
      <div class="text-center">
        <div class="flex justify-center items-center gap-3">
          <h1 class="text-[#374151] font-[Outfit] text-[20px] lg:text-[24px] font-medium">
            Selamat datang
          </h1>
          <img src="~/assets/images/love.png" alt="" />
        </div>
        <h1 class="text-[#374151] font-[Outfit] text-[26px] lg:text-[32px] font-semibold">
          Kadek Gandi Taruna Wijaya
        </h1>
        <div class="my-4">
          <img class="mx-auto w-32 h-32 lg:w-52 lg:h-52" src="~/assets/images/icon-member.png" alt="" />
        </div>
        <h2 class="text-[#374151] font-[Outfit] text-[22px] lg:text-[24px] font-semibold mb-2">
          30 September 2025
        </h2>
        <div class="flex justify-center items-center gap-2 mb-3">
          <img class="w-5 h-5" src="~/assets/images/calender.png" alt="" />
          <h3>Masa Aktif</h3>
        </div>
      </div>
    </div>
  </section>

  <section class="pt-[10px]">
    <div class="container mx-auto px-5 lg:px-16">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Produk Digital
      </h2>
      <div class="divide-y divide-gray-200">
        <div v-for="(item, index) in idata" :key="index" class="flex justify-between items-center py-3">
          <img :src="item.image" :alt="item.title" class="w-24 h-24 object-contain" />
          <button @click="openAccountModal(item.title)" class="text-[#0080FF] font-semibold hover:underline">
            Lihat akun
          </button>
        </div>
      </div>
    </div>
  </section>

  <section>
    <div class="container mx-auto px-6 lg:px-16 lg:py-8">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-xl md:text-4xl font-semibold text-gray-900">
          Histori Pembelian
        </h1>
        <p class="text-[#0080FF] font-semibold">Histori Tagihan</p>
      </div>
      <div class="w-full lg:max-w-[500px] mx-auto lg:p-4 mb-3 lg:mb-0">
        <div
          class="bg-gradient-to-r from-[#E3F0FF] to-[#DFF5FF] rounded-xl shadow-md p-4"
        >
          <div class="flex justify-between items-start mb-3">
            <div class="flex items-start gap-4">
              <img
                src="~/assets/images/logo-konek-biru.png"
                alt="Konek Market"
                class="w-16 h-auto"
              />
              <div>
                <p class="text-sm lg:text-lg font-medium mb-2">
                  Konek Entertainment
                </p>
                <div class="text-sm text-gray-800 space-y-1">
                  <p>
                    ID Pesanan:
                    <span class="font-medium">KNX-20250828-ABC123</span>
                  </p>
                  <p>
                    Tanggal: <span class="font-medium">27 September 2025</span>
                  </p>
                  <p>
                    Metode Bayar:
                    <span class="font-medium">QRIS (via GoPay)</span>
                  </p>
                </div>
              </div>
            </div>
            <button
              class="bg-gradient-to-r from-[#0080FF] to-[#4DC9E6] text-white text-sm px-3 py-1 rounded-md font-medium"
            >
              Lihat Detail
            </button>
          </div>
          <div class="flex justify-between items-center mt-4">
            <p class="text-xl font-bold">Rp.99.000</p>
            <p class="text-green-600 font-bold">STATUS BERHASIL</p>
          </div>
        </div>
      </div>
            <div class="w-full lg:max-w-[500px] mx-auto lg:p-4 mb-3 lg:mb-0">
        <div
          class="bg-gradient-to-r from-[#E3F0FF] to-[#DFF5FF] rounded-xl shadow-md p-4"
        >
          <div class="flex justify-between items-start mb-3">
            <div class="flex items-start gap-4">
              <img
                src="~/assets/images/logo-konek-biru.png"
                alt="Konek Market"
                class="w-16 h-auto"
              />
              <div>
                <p class="text-sm lg:text-lg font-medium mb-2">
                  Konek Entertainment
                </p>
                <div class="text-sm text-gray-800 space-y-1">
                  <p>
                    ID Pesanan:
                    <span class="font-medium">KNX-20250828-ABC123</span>
                  </p>
                  <p>
                    Tanggal: <span class="font-medium">27 September 2025</span>
                  </p>
                  <p>
                    Metode Bayar:
                    <span class="font-medium">QRIS (via GoPay)</span>
                  </p>
                </div>
              </div>
            </div>
            <button
              class="bg-gradient-to-r from-[#0080FF] to-[#4DC9E6] text-white text-sm px-3 py-1 rounded-md font-medium"
            >
              Lihat Detail
            </button>
          </div>
          <div class="flex justify-between items-center mt-4">
            <p class="text-xl font-bold">Rp.99.000</p>
            <p class="text-green-600 font-bold">STATUS BERHASIL</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <section>
    <div class="container mx-auto px-6 lg:py-8">
      <div class="max-w-md mx-auto bg-white rounded-lg">
        <h1 class="text-xl md:text-3xl font-bold text-gray-900 mb-3">
          Hubungi Kami
        </h1>
        <h2 class="text-md md:text-xl font-medium text-gray-900 mb-2">
          Jam Operasional
        </h2>
        <div class="flex justify-between items-center mb-2">
          <h3 class="">Senin - Jumat :</h3>
          <p class="font-semibold">09.00 - 17.00 WITA</p>
        </div>
        <div class="flex justify-between items-center mb-2">
          <h3>Sabtu :</h3>
          <p class="font-semibold">09.00 - 17.00 WITA</p>
        </div>
        <div class="flex justify-between items-center">
          <h3>Minggu & Tanggal Merah :</h3>
          <p class="text-red-500 font-semibold">Libur</p>
        </div>
      </div>
      <div class="w-full max-w-md mx-auto my-4">
        <div
          class="flex items-center justify-between border rounded-xl px-4 py-3 shadow-sm bg-white"
        >
          <div class="flex items-center space-x-3">
            <img src="~/assets/images/wa.png" alt="WhatsApp" class="w-6 h-6" />
            <span class="text-[#111827] font-semibold">Admin Konek Plus</span>
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-5 h-5 text-gray-500"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  </section>

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
#login {
  background: linear-gradient(
    107deg,
    #3ef7f7 2.61%,
    #0080ff 51.9%,
    #30c1ff 101.2%
  );
}
</style>