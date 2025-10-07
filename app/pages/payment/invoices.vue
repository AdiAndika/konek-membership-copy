<script setup>
import { ref, onMounted, computed } from "vue";
import { api } from "~/services/api";
import { useAuth } from "~/composables/useState";
import { useRouter, useRoute } from "vue-router";
import LoadingSpinner from '~/components/LoadingSpinner.vue'; // Impor spinner

definePageMeta({
  layout: "default",
});

const auth = useAuth();
const router = useRouter();
const route = useRoute(); // Gunakan useRoute untuk mengakses query

// --- STATE ---
const invoices = ref([]);
const isLoading = ref(true);
const errorMessage = ref(null);
const selectedInvoice = ref(null);
const copyStatus = ref('Salin ID');

// --- LIFECYCLE HOOK ---
onMounted(async () => {
  if (!auth.value.user?.id) {
    return router.push("/auth/login");
  }
  await fetchInvoices();

  // Cek jika ada ID di query parameter untuk langsung menampilkan detail
  const invoiceIdFromQuery = route.query.id;
  if (invoiceIdFromQuery) {
    const foundInvoice = invoices.value.find(inv => inv.invoice_id == invoiceIdFromQuery);
    if (foundInvoice) {
      selectedInvoice.value = foundInvoice;
    }
  }
});

// --- METHODS ---
const fetchInvoices = async () => {
  try {
    isLoading.value = true;
    const response = await api.getInvoiceList(auth.value.user.id, 10, "latest");
    if (response.data) {
      invoices.value = response.data;
    }
  } catch (error) {
    console.error("Gagal mengambil daftar invoice:", error);
    errorMessage.value = "Gagal memuat data invoice. Silakan coba lagi.";
  } finally {
    isLoading.value = false;
  }
};

const showDetail = (invoice) => {
  selectedInvoice.value = invoice;
};

const goBackToList = () => {
  selectedInvoice.value = null;
  // Hapus query param dari URL saat kembali ke daftar
  router.replace({ query: {} });
};

const formatCurrency = (price) => {
  if (price === null || price === undefined) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getStatusBadgeClass = (status) => {
  if (!status) return "bg-slate-100 text-slate-600";
  const s = status.toLowerCase();
  if (s === "paid" || s === "berhasil") return "bg-emerald-100 text-emerald-700";
  if (s === "pending" || s === 'menunggu') return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
};

// --- COMPUTED PROPERTIES FOR DETAIL VIEW ---
const statusInfo = computed(() => {
  if (!selectedInvoice.value) return {};
  const status = selectedInvoice.value.status?.toLowerCase();
  if (status === 'paid' || status === 'berhasil') {
    return { text: 'Berhasil', class: 'bg-green-100 text-green-800' };
  }
  if (status === 'pending' || status === 'menunggu') {
    return { text: 'Pending', class: 'bg-yellow-100 text-yellow-800' };
  }
  return { text: selectedInvoice.value.status || 'Gagal', class: 'bg-red-100 text-red-700' };
});

// --- METHODS FOR DETAIL VIEW ---
const copyInvoiceId = () => {
  if (!selectedInvoice.value) return;
  navigator.clipboard.writeText(selectedInvoice.value.invoice_no).then(() => {
    copyStatus.value = 'Tersalin!';
    setTimeout(() => {
      copyStatus.value = 'Salin ID';
    }, 2000);
  }).catch(err => {
    console.error('Gagal menyalin:', err);
    copyStatus.value = 'Gagal';
  });
};

const downloadInvoice = () => {
  alert('Fitur unduh belum diimplementasikan.');
};
</script>

<template>
  <div class="bg-slate-50 font-sans min-h-screen">
    
    <div v-if="selectedInvoice" class="container mx-auto max-w-lg p-4">
      <header class="flex items-center mb-6">
        <button @click="goBackToList" class="text-blue-500 font-semibold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </button>
      </header>

      <main class="text-center">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Detail Pemesanan</h1>
        
        <img src="~/assets/images/invoice.svg" alt="Invoice Icon" class="w-20 h-20 mx-auto mb-4"/>

        <p class="text-4xl font-bold text-gray-900">{{ formatCurrency(selectedInvoice.amount) }}</p>
        <p class="text-gray-500 mt-1">{{ selectedInvoice.invoice_no }}</p>

        <div class="border-t border-b border-gray-200 my-6 py-4 px-2 space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Status</span>
            <span class="text-sm font-semibold px-3 py-1 rounded-full" :class="statusInfo.class">
              {{ statusInfo.text }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Tanggal Transaksi</span>
            <span class="font-semibold text-gray-800">{{ formatDate(selectedInvoice.created_at) }}</span>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6 text-left">
          <div class="flex justify-between items-start mb-6">
            <h2 class="text-xl font-bold text-gray-900">{{ selectedInvoice.pelanggan_membership?.product_membership?.name || 'Paket Membership' }}</h2>
            <button @click="copyInvoiceId" class="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50" :title="copyStatus">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>

          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">No. Invoice</span>
              <span class="font-medium text-gray-800">{{ selectedInvoice.invoice_no }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Metode Bayar</span>
              <span class="font-medium text-gray-800 capitalize">{{ selectedInvoice.payment?.payment_method || 'Belum Dipilih' }}</span>
            </div>
          </div>

          <hr class="my-4 border-gray-200" />

          <div class="flex justify-between items-center">
            <span class="text-base font-bold text-blue-600">Total</span>
            <span class="text-base font-bold text-blue-600">{{ formatCurrency(selectedInvoice.amount) }}</span>
          </div>
        </div>

        <div class="mt-8">
          <button @click="downloadInvoice" class="w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Unduh</span>
          </button>
        </div>
      </main>
    </div>

    <div v-else class="container mx-auto px-4 lg:px-8 py-16">
      <div class="max-w-3xl mx-auto text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">
          Riwayat Pembelian
        </h1>
        <p class="mt-4 text-lg text-slate-600">
          Kelola dan lihat semua transaksi membership Anda di satu tempat.
        </p>
      </div>

      <div class="max-w-3xl mx-auto">
        <div v-if="isLoading" class="text-center text-slate-500 py-10">
          <LoadingSpinner />
        </div>
        <div v-else-if="errorMessage" class="bg-rose-100 border-l-4 border-rose-500 text-rose-700 p-4 rounded-md shadow-sm">
          <p class="font-semibold">Oops, terjadi kesalahan</p>
          <p>{{ errorMessage }}</p>
        </div>
        <div v-else-if="invoices.length === 0" class="text-center bg-white p-12 rounded-xl shadow-sm border">
          <img src="~/assets/images/icon-langganan.svg" alt="Tidak ada transaksi" class="w-40 h-40 mx-auto mb-6 opacity-70" />
          <h2 class="text-2xl font-semibold text-slate-700">Belum Ada Transaksi</h2>
          <p class="text-slate-500 mt-2">
            Anda akan melihat riwayat pembelian setelah melakukan transaksi pertama.
          </p>
        </div>

        <div v-else class="space-y-5">
          <div
            v-for="invoice in invoices"
            :key="invoice.invoice_id"
            @click="showDetail(invoice)"
            class="bg-white rounded-xl border border-slate-200 p-5 transition-all duration-300 hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 cursor-pointer"
          >
            <div class="flex flex-col sm:flex-row justify-between gap-5">
              <div class="flex items-center gap-4">
                <div class="hidden sm:flex bg-blue-50 text-blue-600 rounded-full h-12 w-12 items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-slate-800 text-lg">
                    {{ invoice.pelanggan_membership?.product_membership?.name || "Paket Membership" }}
                  </p>
                  <div class="flex items-center gap-3 text-sm text-slate-500 mt-1">
                    <span>No. {{ invoice.invoice_no }}</span>
                    <span class="text-slate-300">|</span>
                    <span>{{ formatDate(invoice.created_at) }}</span>
                  </div>
                </div>
              </div>

              <div class="flex flex-col items-start sm:items-end justify-between gap-3">
                <p class="text-xl font-bold text-slate-800">
                  {{ formatCurrency(invoice.amount) }}
                </p>
                <div class="flex items-center gap-3">
                  <span :class="getStatusBadgeClass(invoice.payment?.status || invoice.status)" class="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                    {{ invoice.payment?.status || invoice.status }}
                  </span>
                  <a
                    v-if="
                      (invoice.status.toLowerCase() === 'pending' || invoice.status.toLowerCase() === 'menunggu') &&
                      invoice.payment &&
                      invoice.payment.checkout_link
                    "
                    :href="invoice.payment.checkout_link"
                    target="_blank"
                    @click.stop 
                    class="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                  >
                    Lanjutkan Pembayaran
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");
.font-sans {
  font-family: "Inter", sans-serif;
}
</style>