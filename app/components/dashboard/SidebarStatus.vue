<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
  userFullName: {
    type: String,
    default: 'Pengguna',
  },
  expiryDate: {
    type: [Date, String],
    default: null,
  },
  // **[PERUBAHAN 1]** Tambahkan prop untuk menerima data invoice
  pendingInvoice: {
    type: Object,
    default: null,
  },
});

const router = useRouter();

// **[PERUBAHAN 2]** Buat fungsi untuk navigasi
const goToInvoice = () => {
  // Pastikan data invoice ada sebelum navigasi
  if (props.pendingInvoice) {
    router.push(
      `/payment/invoices?invoice_id=${props.pendingInvoice.invoice_id}&invoice_no=${props.pendingInvoice.invoice_no}`
    );
  }
};

const daysRemaining = computed(() => {
  if (props.status !== 'active' || !props.expiryDate) return 0;
  const now = new Date();
  const expiry = new Date(props.expiryDate);
  const diffTime = expiry - now;
  if (diffTime < 0) return 0;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

const formattedExpiryDate = computed(() => {
  if (props.status !== 'active' || !props.expiryDate) return 'Tidak Aktif';
  return new Date(props.expiryDate).toLocaleDateString('id-ID', {
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
    strokeDashoffset: offset,
  };
});
</script>

<template>
  <aside class="lg:w-1/3 xl:w-1/4 mb-8 lg:mb-0">
    <div class="rounded-2xl bg-white w-full max-w-sm mx-auto shadow-xl p-6 text-center sticky top-8">
      <p class="text-gray-600">Selamat Datang 👋</p>
      <h1 class="text-2xl font-bold text-gray-900 truncate">{{ userFullName }}</h1>

      <div v-if="status === 'active'">
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

      <div v-if="status === 'pending'">
        <div class="my-6">
          <img class="mx-auto w-70 h-70 lg:w-40 lg:h-40" src="~/assets/images/pending-status.svg" alt="Icon Pending" />
        </div>
        <p class="font-semibold text-lg text-gray-900 mb-4">
            Selesaikan pembayaran untuk mengaktifkan akun Anda.
        </p>
        <button
          @click="goToInvoice"
          class="w-full bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-yellow-600 transition-colors">
          Lanjutkan Pembayaran
        </button>
      </div>
    </div>
  </aside>
</template>