<script setup>
import { computed } from 'vue';

const props = defineProps({
  invoice: {
    type: Object,
    default: null,
  },
  userFullName: {
    type: String,
    default: 'Pengguna'
  }
});

const emit = defineEmits(["close"]);

// Mengambil konfigurasi runtime untuk nomor WhatsApp admin
const config = useRuntimeConfig();

// Membuat link WhatsApp dengan pesan yang sudah diisi sebelumnya
const contactLink = computed(() => {
  if (!props.invoice || !config.public.ADMIN_WHATSAPP_NUMBER) {
    return '#';
  }
  const message = `Halo Admin, saya ${props.userFullName}. Invoice saya dengan nomor ${props.invoice.invoice_no} telah kadaluwarsa. Mohon bantuannya untuk proses selanjutnya.`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${config.public.ADMIN_WHATSAPP_NUMBER}?text=${encodedMessage}`;
});
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    @click.self="emit('close')"
  >
    <div
      class="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-8 text-center"
    >
      <button
        @click="emit('close')"
        class="absolute -top-3 -right-3 bg-red-500 text-white rounded-full h-8 w-8 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
        aria-label="Tutup Notifikasi"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div
        class="mx-auto mb-4 bg-red-100 rounded-full h-20 w-20 flex items-center justify-center"
      >
        <img
          src="~/assets/images/bell-icon.svg"
          alt="Notifikasi Kadaluwarsa"
          class="w-12 h-12"
        />
      </div>

      <div>
        <h2 class="text-xl font-bold text-gray-800 mb-2">Pembayaran Berakhir</h2>
        <p class="text-base font-medium text-gray-700 mb-6">
          Waktu pembayaran untuk Paket Anda telah habis. Silakan hubungi admin untuk membuat pesanan baru.
        </p>
        <a
          :href="contactLink"
          target="_blank"
          @click="emit('close')"
          class="w-full flex items-center justify-center gap-2 bg-red-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-600 transition-colors"
        >
            <!-- WA Logo -->
            <svg
                class="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 448 512">
                <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc. -->
                <path
                d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
            </svg>
          <span>Hubungi Admin</span>
        </a>
      </div>
    </div>
  </div>
</template>