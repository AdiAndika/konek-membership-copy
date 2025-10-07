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
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-yellow-500">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
      </div>
      
      <div v-if="type === 'success'">
        <p class="text-lg font-medium text-gray-700 mb-6">
          Pembayaran berhasil! Akun Anda sedang disiapkan. Jika akun belum siap dalam 1x24 jam, Anda bisa mengajukan refund.
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
          Pembayaran Anda <b class="text-yellow-500">Pending</b>. Selesaikan pembayaran untuk menikmati semua layanan.
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