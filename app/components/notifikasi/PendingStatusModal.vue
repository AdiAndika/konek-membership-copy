<script setup>
defineProps({
  // Tipe notifikasi: 'pending', 'success', atau 'expired'
  type: {
    type: String,
    default: 'pending',
  },
});

const emit = defineEmits(['close', 'action']);
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    @click.self="emit('close')"
  >
    <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-8 text-center">
      <button
        @click="emit('close')"
        class="absolute -top-3 -right-3 bg-red-500 text-white rounded-full h-8 w-8 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div v-if="type === 'success'" class="mx-auto mb-4 bg-green-100 rounded-full h-20 w-20 flex items-center justify-center">
        <img src="~/assets/images/success-check.svg" alt="Success" class="w-12 h-12" />
      </div>
      <div v-else class="mx-auto mb-4 bg-yellow-100 rounded-full h-20 w-20 flex items-center justify-center">
        <img src="~/assets/images/pending-status.svg" alt="Pending" class="w-12 h-12" />
      </div>
      
      <div v-if="type === 'success'">
        <p class="text-lg font-medium text-gray-700 mb-6">
          Yey, pembayaran untuk paket <b class="text-blue-500">Konek Entertainment</b> berhasil! Akun Digitalmu Sedang disiapkan, Login Kembali saat akun kamu sudah siap.
        </p>
        <button
          @click="emit('close')"
          class="w-full py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
        >
          Mengerti
        </button>
      </div>

      <div v-else-if="type === 'expired'">
        <p class="text-lg font-medium text-gray-700 mb-6">
          Waktu pembayaran Anda sudah habis. Silakan buat pesanan baru untuk melanjutkan.
        </p>
        <button
          @click="emit('action')"
          class="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
        >
          <img src="~/assets/images/cart.png" alt="cart" class="w-5 h-5" />
          Langganan Sekarang
        </button>
      </div>

      <div v-else>
        <p class="text-lg font-medium text-gray-700 mb-6">
          Pembayaran kamu <b class="text-yellow-500">Pending</b>, selesaikan pembayaranmu agar bisa menikmati semua layanan.
        </p>
        <button
          @click="emit('action')"
          class="w-full py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
        >
          Lanjutkan Pembayaran
        </button>
      </div>
    </div>
  </div>
</template>