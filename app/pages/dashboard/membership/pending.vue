<script setup>
import { ref, onMounted } from 'vue';
import { api } from '~/services/api';
import { useAuth } from '~/composables/useState';

const auth = useAuth();
const userFullName = ref(auth.value.user?.full_name || 'Pengguna');
const invoices = ref([]); // State untuk menyimpan data invoice
const isLoadingInvoices = ref(true); // State loading khusus untuk invoice

onMounted(async () => {
  if (auth.value.user && auth.value.user.id) {
    isLoadingInvoices.value = true;
    try {
      const response = await api.getInvoiceList(auth.value.user.id);
      if (response.data) {
        invoices.value = response.data;
      }
    } catch (error) {
      console.error("Gagal mengambil data invoice:", error);
    } finally {
      isLoadingInvoices.value = false;
    }
  } else {
    isLoadingInvoices.value = false;
  }
});

// --- Helper Functions ---
const getStatusClass = (status) => {
  const lowerCaseStatus = status.toLowerCase();
  if (lowerCaseStatus === 'paid' || lowerCaseStatus === 'berhasil') {
    return 'text-green-600';
  }
  if (lowerCaseStatus === 'pending') {
    return 'text-yellow-500';
  }
  return 'text-red-500';
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

// Data statis untuk produk digital (bisa disesuaikan)
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

              <div v-if="isLoadingInvoices" class="text-center p-4">Memuat histori...</div>
              <div v-else-if="invoices.length === 0" class="text-center p-4 text-gray-500">
                Belum ada histori pembelian.
              </div>
              <div v-else class="space-y-4">
                <div 
                  v-for="invoice in invoices" 
                  :key="invoice.invoice_id"
                  class="bg-gradient-to-r from-[#E3F0FF] to-[#DFF5FF] rounded-xl shadow-md p-4"
                >
                  <div class="flex justify-between items-start mb-3">
                    <div class="flex items-start gap-4">
                      <img src="~/assets/images/logo-konek-biru.png" alt="Konek Market" class="w-16 h-auto" />
                      <div>
                        <p class="text-base font-medium mb-2">{{ invoice.pelanggan_membership.product_membership.name }}</p>
                        <div class="text-xs text-gray-800 space-y-1">
                          <p>ID: <span class="font-medium">{{ invoice.invoice_no }}</span></p>
                          <p>Tanggal: <span class="font-medium">{{ new Date(invoice.created_at).toLocaleDateString('id-ID') }}</span></p>
                        </div>
                      </div>
                    </div>
                     <NuxtLink :to="`/invoice/${invoice.invoice_id}`" class="bg-gradient-to-r from-[#0080FF] to-[#4DC9E6] text-white text-xs px-3 py-1 rounded-md font-medium">
                      Detail
                    </NuxtLink>
                  </div>
                   <div class="flex justify-between items-center mt-4">
                    <p class="text-lg font-bold">{{ formatCurrency(invoice.amount) }}</p>
                    <p class="font-bold text-sm uppercase" :class="getStatusClass(invoice.status)">
                      {{ invoice.status }}
                    </p>
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