<script setup>
import { ref, onMounted } from "vue";
import { api } from "~/services/api";
import { useAuth } from "~/composables/useState";
import { useRouter } from "vue-router";

definePageMeta({
  layout: "default",
});

const auth = useAuth();
const router = useRouter();
const invoices = ref([]);
const isLoading = ref(true);
const errorMessage = ref(null);
// State 'loadingInvoices' tidak lagi diperlukan dan telah dihapus

onMounted(async () => {
  if (!auth.value.user?.id) {
    return router.push("/auth/login");
  }
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
});

// Fungsi 'handleContinuePayment' yang memanggil orderPackage telah dihapus
// karena kita akan menggunakan link langsung dari data.

const formatPrice = (price) => {
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
  if (s === "paid" || s === "berhasil")
    return "bg-emerald-100 text-emerald-700";
  if (s === "pending") return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
};
</script>

<template>
  <div class="bg-slate-50 font-sans min-h-screen">
    <div class="container mx-auto px-4 lg:px-8 py-16">
      <div class="max-w-3xl mx-auto text-center mb-12">
        <h1
          class="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight"
        >
          Riwayat Pembelian
        </h1>
        <p class="mt-4 text-lg text-slate-600">
          Kelola dan lihat semua transaksi membership Anda di satu tempat.
        </p>
      </div>

      <div class="max-w-3xl mx-auto">
        <div v-if="isLoading" class="text-center text-slate-500 py-10">
          <p>Memuat riwayat pembelian Anda...</p>
        </div>
        <div
          v-else-if="errorMessage"
          class="bg-rose-100 border-l-4 border-rose-500 text-rose-700 p-4 rounded-md shadow-sm"
        >
          <p class="font-semibold">Oops, terjadi kesalahan</p>
          <p>{{ errorMessage }}</p>
        </div>
        <div
          v-else-if="invoices.length === 0"
          class="text-center bg-white p-12 rounded-xl shadow-sm border"
        >
          <img
            src="~/assets/images/icon-langganan.svg"
            alt="Tidak ada transaksi"
            class="w-40 h-40 mx-auto mb-6 opacity-70"
          />
          <h2 class="text-2xl font-semibold text-slate-700">
            Belum Ada Transaksi
          </h2>
          <p class="text-slate-500 mt-2">
            Anda akan melihat riwayat pembelian setelah melakukan transaksi
            pertama.
          </p>
        </div>

        <div v-else class="space-y-5">
          <div
            v-for="invoice in invoices"
            :key="invoice.invoice_id"
            class="bg-white rounded-xl border border-slate-200 p-5 transition-all duration-300 hover:shadow-lg hover:border-blue-500 hover:-translate-y-1"
          >
            <div class="flex flex-col sm:flex-row justify-between gap-5">
              <div class="flex items-center gap-4">
                <div
                  class="hidden sm:flex bg-blue-50 text-blue-600 rounded-full h-12 w-12 items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-slate-800 text-lg">
                    {{
                      invoice.pelanggan_membership?.product_membership?.name ||
                      "Paket Membership"
                    }}
                  </p>
                  <div
                    class="flex items-center gap-3 text-sm text-slate-500 mt-1"
                  >
                    <span>No. {{ invoice.invoice_no }}</span>
                    <span class="text-slate-300">|</span>
                    <span>{{ formatDate(invoice.created_at) }}</span>
                  </div>
                </div>
              </div>

              <div
                class="flex flex-col items-start sm:items-end justify-between gap-3"
              >
                <p class="text-xl font-bold text-slate-800">
                  {{ formatPrice(invoice.amount) }}
                </p>
                <div class="flex items-center gap-3">
                  <span
                    :class="
                      getStatusBadgeClass(
                        invoice.payment?.status || invoice.status
                      )
                    "
                    class="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider"
                  >
                    {{ invoice.payment?.status || invoice.status }}
                  </span>

                  <!-- PERUBAHAN DI SINI: Tombol diubah menjadi <a> tag -->
                  <a
                    v-if="
                      invoice.status.toLowerCase() !== 'paid' &&
                      invoice.status.toLowerCase() !== 'berhasil' &&
                      invoice.payment &&
                      invoice.payment.checkout_link
                    "
                    :href="invoice.payment.checkout_link"
                    target="_blank"
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
