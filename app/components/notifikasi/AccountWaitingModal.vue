<script setup>
const emit = defineEmits(['close']);
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
    @click.self="emit('close')"
  >
    <div
      class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-5 flex items-center gap-4"
    >
      <button
        @click="emit('close')"
        class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-7 w-7 flex items-center justify-center shadow-md hover:bg-red-600 transition-transform hover:scale-110 focus:outline-none"
        aria-label="Tutup Notifikasi"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="3"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div
        class="flex-shrink-0 bg-yellow-100 rounded-full h-16 w-16 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-9 w-9 text-yellow-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
      </div>

      <div class="text-left">
        <p class="text-sm font-medium text-gray-700 leading-snug">
          Yey, pembayaran untuk paket
          <b class="text-blue-500">Konek Entertainment</b> berhasil! Akun
          Digitalmu Sedang disiapkan. Login kembali saat akun kamu sudah siap.
          Jangan khawatir, jika selama <b class="text-blue-500">30 Menit</b> akun kamu belum
          siap, kamu bisa melakukan refund melalui Kontak WA Admin kami.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.animate-fade-in {
  animation: fade-in 0.2s ease-out forwards;
}
</style>