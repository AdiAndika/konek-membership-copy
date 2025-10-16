<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  invoices: {
    type: Array,
    default: () => [],
  },
  isLoading: Boolean,
});

const router = useRouter();

// PERBAIKAN 1: Logika disederhanakan.
// Fungsi ini sekarang hanya bertugas mengarahkan ke halaman detail
// dengan membawa ID dan nomor invoice.
const handleDetailClick = (invoice) => {
  if (invoice && invoice.invoice_id && invoice.invoice_no) {
    router.push(
      `/payment/invoices?invoice_id=${invoice.invoice_id}&invoice_no=${invoice.invoice_no}`
    );
  }
};

// Fungsi helper untuk status dan format tetap sama.
const getStatusInfo = (invoice) => {
  const status = invoice.status ? invoice.status.toLowerCase() : "";
  if (status === "paid" || status === "berhasil") {
    return { text: "Lunas", class: "text-green-600" };
  }
  if (status === "expired") {
    return { text: "Kadaluwarsa", class: "text-red-500" };
  }
  if (status === "pending" || status === "menunggu") {
    return { text: "Pending", class: "text-yellow-500" };
  }
  return { text: invoice.status || "Gagal", class: "text-red-500" };
};

const formatCurrency = (value) => {
  if (typeof value !== "number") return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
</script>

<template>
  <section>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl md:text-3xl font-semibold text-gray-900">
        Histori Pembelian
      </h1>
      <!-- PERBAIKAN 2: Link "Lihat Semua" ini sebenarnya tidak lagi relevan
           karena halaman `invoices.vue` kini adalah halaman detail.
           Namun, kita biarkan saja untuk saat ini jika Anda ingin membuat halaman
           daftar lengkap di masa depan. -->
      <!-- <NuxtLink
        to="/payment/invoices"
        class="text-sm font-semibold text-blue-600 hover:underline"
      >
        Lihat Detail
      </NuxtLink> -->
    </div>

    <div v-if="isLoading" class="text-center p-4 text-gray-500">
      Memuat histori...
    </div>
    <div
      v-else-if="!invoices || invoices.length === 0"
      class="text-center p-4 text-gray-500"
    >
      Belum ada histori pembelian.
    </div>
    <div v-else class="space-y-4">
      <div
        v-for="invoice in invoices"
        :key="invoice.invoice_id"
        class="bg-gradient-to-r from-[#E3F0FF] to-[#DFF5FF] rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
        @click="handleDetailClick(invoice)"
      >
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-start gap-4">
            <img
              src="~/assets/images/logo-konek-biru.png"
              alt="Konek Market"
              class="w-16 h-auto"
            />
            <div>
              <p class="text-base font-medium mb-2">
                {{
                  invoice.pelanggan_membership?.product_membership?.name ||
                  "Paket Membership"
                }}
              </p>
              <div class="text-xs text-gray-800 space-y-1">
                <p>
                  No: <span class="font-medium">{{ invoice.invoice_no }}</span>
                </p>
                <p>
                  Tanggal:
                  <span class="font-medium">{{
                    formatDate(invoice.created_at)
                  }}</span>
                </p>
              </div>
            </div>
          </div>
          <button
            class="bg-gradient-to-r from-[#0080FF] to-[#4DC9E6] text-white text-xs px-3 py-1 rounded-md font-medium"
          >
            Detail
          </button>
        </div>
        <div class="flex justify-between items-center mt-4">
          <p class="text-lg font-bold">{{ formatCurrency(invoice.amount) }}</p>
          <p
            class="font-bold text-sm uppercase"
            :class="getStatusInfo(invoice).class"
          >
            {{ getStatusInfo(invoice).text }}
          </p>
        </div>
      </div>
    </div>

    <!-- PERBAIKAN 3: Modal sudah dihapus dari komponen ini -->
    <!-- Logika modal sekarang ada di halaman detail invoice jika diperlukan -->
  </section>
</template>
