<script setup>
import { ref } from 'vue';
import { useRuntimeConfig } from '#app';

const emit = defineEmits(['close']);

// State untuk form (hanya username dan email)
const username = ref('');
const email = ref('');
const isLoading = ref(false);

// Ambil nomor WhatsApp Admin dari konfigurasi runtime
const config = useRuntimeConfig();
const ADMIN_WHATSAPP_NUMBER = config.public.ADMIN_WHATSAPP_NUMBER;

const handleRegister = () => {
  // Validasi hanya untuk username dan email
  if (!username.value || !email.value || !ADMIN_WHATSAPP_NUMBER) {
    alert('Harap isi semua kolom.');
    return;
  }
  
  isLoading.value = true;

  // Template pesan WhatsApp disederhanakan
  const message = `Membership Register
Username: ${username.value}
Email: ${email.value}`;

  const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  // Buka WhatsApp dan tutup modal
  setTimeout(() => {
    window.open(whatsappUrl, '_blank');
    isLoading.value = false;
    emit('close');
  }, 500);
};
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
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

      <h2 class="text-2xl font-bold text-gray-800 mb-6">Daftar Akun Baru</h2>
      
      <form @submit.prevent="handleRegister" class="space-y-4 text-left">
        <div>
          <label for="username" class="block mb-1 text-sm font-medium text-gray-700">Username</label>
          <input
            v-model="username"
            type="text"
            id="username"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Masukkan username Anda"
            required
          />
        </div>
        <div>
          <label for="email" class="block mb-1 text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="emailanda@gmail.com"
            required
          />
        </div>
        
        <div class="pt-4">
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-gray-400"
          >
            {{ isLoading ? 'Mengarahkan...' : 'Daftar via WhatsApp' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fade-in 0.2s ease-out forwards;
}
</style>