<script setup>
import { computed } from 'vue';

const props = defineProps({
  expiryDate: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['close']);

// Format tanggal agar mudah dibaca (contoh: 30 September 2025)
const formattedExpiryDate = computed(() => {
  if (!props.expiryDate) return '';
  return new Date(props.expiryDate).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
});
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
        aria-label="Tutup Notifikasi"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div class="mx-auto mb-4 bg-yellow-100 rounded-full h-20 w-20 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
      </div>

      <div>
        <p class="text-lg font-medium text-gray-700">
          <span class="font-semibold text-blue-500">Premium</span> kamu akan berakhir pada
        </p>
        <p class="text-blue-500 font-bold text-2xl my-1">
          {{ formattedExpiryDate }}
        </p>
        <p class="text-gray-600">
          Mohon perbarui lagi akses pada fitur Premium.
        </p>
      </div>
    </div>
  </div>
</template>