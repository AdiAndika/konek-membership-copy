<script setup>
import { ref, onMounted } from 'vue';
import { api } from '~/services/api';
import { useAuth } from '~/composables/useState';

// --- State ---
const userFullName = ref('Pengguna');
const auth = useAuth();

// --- Lifecycle Hook untuk Mengambil Data Nama dari API ---
onMounted(async () => {
  if (auth.value.user && auth.value.user.id) {
    try {
      const response = await api.getUserDetail(auth.value.user.id);
      if (response.data && response.data.full_name) {
        userFullName.value = response.data.full_name;
      }
    } catch (error) {
      console.error("Gagal mengambil nama pengguna:", error);
    }
  }
});

// --- Data untuk list produk ---
const idata = [
  { title: "Netflix", image: "/images/netflix.png" },
  { title: "Spotify", image: "/images/spotify.png" },
  { title: "VIU", image: "/images/viu_full.png" },
  { title: "WeTV", image: "/images/wetv.png" },
];
</script>

<template>
  <div style="background: linear-gradient(180deg, #0080ff 0%, #fff 25%)">
    <div class="container mx-auto px-4 lg:px-8 py-8">
      <div class="lg:flex lg:gap-8 xl:gap-12">

        <aside class="lg:w-1/3 xl:w-1/4 mb-8 lg:mb-0">
          <div class="rounded-2xl bg-white w-full max-w-sm mx-auto shadow-xl p-6 text-center sticky top-8">
            <p class="text-gray-600">Selamat Datang 👋</p>
            <h1 class="text-2xl font-bold text-gray-900 truncate">{{ userFullName }}</h1>

            <div class="my-6">
              <img
                class="mx-auto w-70 h-70 lg:w-40 lg:h-40"
                src="~/assets/images/pending-status.svg"
                alt="Icon Pending"
              />
            </div>
          </div>
        </aside>

        <main class="lg:w-2/3 xl:w-3/4">
          <section class="mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 lg:text-gray-50 mb-4">
              Produk Digital
            </h2>
            <div class="divide-y divide-gray-200 bg-white p-4 rounded-xl shadow-sm">
              <div v-for="(item, index) in idata" :key="index" class="flex justify-between items-center py-3">
                <img :src="item.image" :alt="item.title" class="w-24 h-24 object-contain" />
                <p class="text-yellow-500 font-semibold">
                  Menunggu...
                </p>
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
                <div class="bg-gradient-to-r from-[#E3F0FF] to-[#DFF5FF] rounded-xl shadow-md p-4">
                  <div class="flex justify-between items-start mb-3">
                     <div class="flex items-start gap-4">
                      <img src="~/assets/images/logo-konek-biru.png" alt="Konek Market" class="w-16 h-auto" />
                      <div>
                        <p class="text-base font-medium mb-2">Konek Entertainment</p>
                        <div class="text-xs text-gray-800 space-y-1">
                          <p>ID: <span class="font-medium">KNX-20250828-ABC123</span></p>
                          <p>Tanggal: <span class="font-medium">27 Agu 2025</span></p>
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
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap");
</style>