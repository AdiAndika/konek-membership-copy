<script setup lang="ts">
import { ref, onMounted } from "vue";
import { api } from "~/services/api.js";
import { useAuth } from "~/composables/useState";
import { usePaymentState } from "~/composables/usePaymentState";
import { useRouter, useRoute } from "vue-router";

definePageMeta({
  layout: "blanknav",
});

// Explicitly type user as any or a proper interface if available
interface User {
  id: string;
  // tambahkan properti lain jika diperlukan
}
const auth = useAuth() as { value: { user: User | undefined | null } };
const router = useRouter();
const route = useRoute(); // Mengambil parameter dari URL
const paymentState = usePaymentState();

// State
const invoiceDetail = ref<any>(null); // Mengganti nama dari latestInvoice
const isLoading = ref(true);
const errorMessage = ref<string | null>(null);
const isRegenerating = ref(false);

// Mengambil data detail invoice berdasarkan parameter di URL
onMounted(async () => {
  const { invoice_id, invoice_no } = route.query;

  if (!invoice_id || !invoice_no) {
    errorMessage.value = "ID atau Nomor Invoice tidak valid.";
    isLoading.value = false;
    return;
  }

  if (!auth.value.user || !auth.value.user.id) {
    return router.push("/auth/login");
  }

  try {
    isLoading.value = true;
    // Memanggil API baru
    const response = await api.getInvoiceDetailByNo(
      invoice_id as string,
      invoice_no as string
    );
    if (response.data) {
      invoiceDetail.value = response.data;
    } else {
      errorMessage.value = "Invoice tidak ditemukan.";
    }
  } catch (error: any) {
    errorMessage.value = error.message || "Gagal memuat data.";
  } finally {
    isLoading.value = false;
  }
});

async function handlePaymentAction() {
  if (!invoiceDetail.value) return;

  const status = invoiceDetail.value.status.toLowerCase();

  if (status === "pending") {
    if (invoiceDetail.value.payment?.checkout_link) {
      window.location.href = invoiceDetail.value.payment.checkout_link;
    } else {
      errorMessage.value = "Link pembayaran tidak ditemukan.";
    }
  } else if (status === "expired") {
    isRegenerating.value = true;
    errorMessage.value = null;
    try {
      const regenerateResponse = await api.regenerateInvoice({
        user_id: auth.value.user?.id,
      });
      const newPayment = regenerateResponse.data?.payment;
      if (newPayment?.checkout_link) {
        paymentState.value = {
          link: newPayment.checkout_link,
          expiry: newPayment.expiry_date,
        };
        router.push("/payment/pay");
      } else {
        throw new Error("Gagal mendapatkan link pembayaran baru.");
      }
    } catch (error: any) {
      errorMessage.value =
        error.message || "Gagal memperbarui link pembayaran.";
    } finally {
      isRegenerating.value = false;
    }
  }
}

const downloadInvoice = () => {
  window.print();
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
const getStatusInfo = (status: string) => {
  if (!status)
    return { text: "Tidak Diketahui", class: "bg-slate-200 text-slate-700" };
  const s = status.toLowerCase();
  if (s === "paid" || s === "berhasil")
    return { text: "Berhasil", class: "bg-green-100 text-green-700" };
  if (s === "pending")
    return { text: "Pending", class: "bg-yellow-100 text-yellow-700" };
  if (s === "expired")
    return { text: "Kedaluwarsa", class: "bg-red-100 text-ted-700" };
  return { text: "Gagal", class: "bg-red-100 text-red-700" };
};
</script>

<template>
  <div class="bg-slate-50 min-h-screen font-sans">
    <div
      class="max-w-md mx-auto bg-white min-h-screen flex flex-col"
      id="invoice-content"
    >
      <header class="p-4 flex-shrink-0 print-hidden">
        <button
          @click="router.back()"
          class="flex items-center gap-2 text-slate-700 font-semibold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Kembali
        </button>
      </header>

      <main class="flex-grow p-6 text-center">
        <div v-if="isLoading" class="py-10 text-slate-500">
          <p>Memuat detail pemesanan...</p>
        </div>
        <div
          v-else-if="errorMessage && !invoiceDetail"
          class="py-10 text-rose-500"
        >
          <p>{{ errorMessage }}</p>
        </div>

        <div v-else-if="invoiceDetail">
          <h1 class="text-2xl font-bold text-slate-800">Detail Pemesanan</h1>

          <img
            src="~/assets/images/iconinvoice.svg"
            alt="Ikon Invoice"
            class="w-32 h-32 mx-auto my-6"
          />

          <p class="text-4xl font-bold text-blue-600">
            {{ formatCurrency(invoiceDetail.amount) }}
          </p>
          <p class="text-slate-500 font-mono mt-1">
            {{ invoiceDetail.invoice_no }}
          </p>

          <hr class="my-6" />

          <div class="space-y-3 text-left">
            <div class="flex justify-between items-center">
              <span class="text-slate-600">Status</span>
              <span
                :class="getStatusInfo(invoiceDetail.status).class"
                class="font-semibold text-sm px-3 py-1 rounded-full"
              >
                {{ getStatusInfo(invoiceDetail.status).text }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-600">Tanggal Pembayaran</span>
              <span class="font-semibold text-slate-800">{{
                formatDate(
                  invoiceDetail.paid_at_original || invoiceDetail.created_at
                )
              }}</span>
            </div>
          </div>

          <div
            class="mt-8 text-left bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
          >
            <div class="p-4 border-b flex justify-between items-center">
              <h2 class="text-xl font-bold text-slate-800">
                Paket Konek <br />
                Entertainment
              </h2>
              <img
                src="~/assets/images/icon-park-solid_doc-detail.svg"
                alt="Ikon Detail"
                class="w-6 h-6"
              />
            </div>
            <div class="p-4 space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-slate-600">No. Invoice</span
                ><span class="font-semibold text-slate-800 font-mono">{{
                  invoiceDetail.invoice_no
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600">Detail Produk</span
                ><span class="font-semibold text-slate-800"
                  >{{
                    invoiceDetail.pelanggan_membership?.product_membership
                      ?.name || "Paket Konek Entertainment"
                  }}
                  (1 Bulan)</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600">Metode Bayar</span
                ><span class="font-semibold text-slate-800">{{
                  invoiceDetail.payment?.channel || "Belum Dibayar"
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600">SubTotal</span
                ><span class="font-semibold text-slate-800">{{
                  formatCurrency(invoiceDetail.amount)
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600">Biaya Admin</span
                ><span class="font-semibold text-slate-800">0</span>
              </div>
            </div>
            <div
              class="p-4 border-t bg-slate-50 flex justify-between font-bold"
            >
              <span class="text-slate-800">Total</span>
              <span class="text-blue-600 text-lg">{{
                formatCurrency(invoiceDetail.amount)
              }}</span>
            </div>
          </div>

          <div
            v-if="errorMessage"
            class="mt-4 bg-rose-100 text-rose-700 p-3 rounded-md text-sm text-left"
          >
            {{ errorMessage }}
          </div>
        </div>
      </main>

      <footer class="p-4 flex-shrink-0 print-hidden space-y-3">
        <button
          v-if="
            invoiceDetail &&
            invoiceDetail.status.toLowerCase() !== 'paid' &&
            invoiceDetail.status.toLowerCase() !== 'berhasil'
          "
          @click="handlePaymentAction"
          :disabled="isRegenerating"
          class="w-full flex items-center justify-center gap-3 bg-green-500 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:bg-green-600"
        >
          <svg
            v-if="isRegenerating"
            class="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>{{
            isRegenerating
              ? "Memuat..."
              : invoiceDetail.status.toLowerCase() === "pending"
              ? "Lanjutkan Pembayaran"
              : "Bayar Ulang"
          }}</span>
        </button>

        <button
          v-if="
            invoiceDetail &&
            (invoiceDetail.status.toLowerCase() === 'paid' ||
              invoiceDetail.status.toLowerCase() === 'berhasil')
          "
          @click="downloadInvoice"
          class="w-full flex items-center justify-center gap-3 bg-blue-600 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:bg-blue-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
          Unduh Invoice
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");
.font-sans {
  font-family: "Inter", sans-serif;
}
@media print {
  .print-hidden {
    display: none;
  }
  main {
    padding: 0;
  }
}
</style>
