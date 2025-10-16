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
  pendingInvoice: {
    type: Object,
    default: null,
  },
  packageId: {
    type: [String, Number],
    default: null,
  },
  packageName: {
    type: String,
    default: 'Membership Konek',
  }
});

const emit = defineEmits(['change-package']);
const router = useRouter();

const config = useRuntimeConfig();
const ADMIN_WHATSAPP_NUMBER = config.public.ADMIN_WHATSAPP_NUMBER;

const renewPackageLink = computed(() => {
  const message = `Halo Admin Konek Membership, saya ${props.userFullName}, ingin perpanjang paket membership saya (${props.packageName}).`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodedMessage}`;
});

const chooseAnotherPackageLink = computed(() => {
  const message = `Halo Admin, saya ${props.userFullName}, ingin melihat dan memilih paket membership lainnya.`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodedMessage}`;
});


const goToInvoice = () => {
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
  if ((props.status !== 'active' && props.status !== 'expired') || !props.expiryDate) return 'Tidak Aktif';
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

      <div v-if="status === 'expired'">
        <div class="relative w-48 h-48 mx-auto my-4">
          <svg class="w-full h-full" viewBox="0 0 120 120">
            <circle class="text-gray-200" stroke-width="10" stroke="currentColor" fill="transparent" r="52" cx="60" cy="60" />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-5xl font-extrabold text-red-500">0</span>
            <span class="text-sm font-semibold text-gray-500">Hari Aktif</span>
          </div>
        </div>
        <h2 class="text-lg font-semibold text-red-500">Paket Telah Berakhir</h2>
        <p class="text-sm text-gray-600 mt-1 mb-4">
          Berakhir pada: {{ formattedExpiryDate }}
        </p>
        <div class="space-y-3">
          <a
            :href="renewPackageLink"
            target="_blank"
            class="flex items-center justify-center gap-2 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
            <img src="~/assets/images/cart.png" alt="cart" class="w-5 h-5" />
            <span>Perpanjang Paket</span>
          </a>
          <a
            :href="chooseAnotherPackageLink"
            target="_blank"
            class="flex items-center justify-center gap-2 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
            <img src="~/assets/images/cart.png" alt="cart" class="w-5 h-5" />
            <span>Pilih Paket Lain</span>
          </a>
        </div>
      </div>

      <div v-if="status === 'pending'">
        <div class="my-6">
          <img class="mx-auto w-70 h-70 lg:w-40 lg:h-40" src="~/assets/images/pending-status.svg" alt="Icon Pending" />
        </div>
        <button
          @click="goToInvoice"
          class="w-full bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-yellow-600 transition-colors">
          Lanjutkan Pembayaran
        </button>
      </div>
    </div>
  </aside>
</template>