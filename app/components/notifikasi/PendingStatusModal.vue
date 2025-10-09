<script setup>
const emit = defineEmits(["close"]);
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
        class="mx-auto mb-4 bg-yellow-100 rounded-full h-20 w-20 flex items-center justify-center"
      >
        <img
          src="~/assets/images/bell-icon.svg"
          alt="Notifikasi Pengingat"
          class="w-12 h-12"
        />
      </div>

      <div>
        <p class="text-lg font-medium text-gray-700 mb-6">
          Pembayaran Anda <b class="text-yellow-500">Pending</b>. Selesaikan
          pembayaran untuk menikmati semua layanan.
        </p>
      </div>
    </div>
  </div>
</template>
