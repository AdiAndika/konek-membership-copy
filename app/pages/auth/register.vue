<script setup>
import { ref, computed } from 'vue';
import { ADMIN_WHATSAPP_NUMBER } from '~/utils/constants';

definePageMeta({
  layout: "blanknav",
});

const phoneNumber = ref('');
const isLoading = ref(false);
const isPhoneValid = computed(() => phoneNumber.value.length > 8);

const registerViaWhatsApp = () => {
  if (!isPhoneValid.value || isLoading.value) return;

  isLoading.value = true;

  // Format pesan HANYA berisi Username dan Email, sesuai permintaan Anda
  const message = encodeURIComponent(
    `Register\nUsername:\nEmail:`
  );
  
  const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${message}`;

  setTimeout(() => {
    window.open(whatsappUrl, '_blank');
    isLoading.value = false;
  }, 500);
};
</script>

<template>
  <div
    class="bg-white md:bg-gray-50 min-h-screen flex flex-col md:justify-center md:items-center font-sans pt-8 md:pt-0"
  >
    <div
      class="w-full md:max-w-md md:shadow-xl md:rounded-2xl md:bg-white flex flex-col"
    >
      <header
        class="p-4 sm:p-6 flex items-center justify-between relative w-full flex-shrink-0"
      >
        <router-link
          to="/"
          class="flex items-center text-gray-700 font-semibold z-10"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
          Kembali
        </router-link>

        <div
          class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <img
            src="~/assets/images/logo-konek-biru.png"
            alt="Konek.id Logo"
            class="h-8"
          />
        </div>
      </header>

      <main
        class="flex-grow flex flex-col items-center text-center px-[1.618rem] sm:px-[2.618rem] pt-[1.618rem] pb-[4.236rem]"
      >
        <div class="w-full max-w-sm">
          <div class="mb-[2.618rem]">
            <h1
              class="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight"
            >
              Selamat Datang Para Pencari Hiburan Digital
            </h1>
            <p class="mt-2 text-sm sm:text-base text-gray-600">
              Masukkan nomor WhatsApp Anda untuk memulai pendaftaran.
            </p>
          </div>

          <h2 class="text-xl sm:text-2xl font-bold mb-[1.618rem]">
            Daftar Akun
          </h2>

          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
            >
              <svg class="w-6 h-5" viewBox="0 0 21 15">
                <g fill="none">
                  <path fill="#FFF" d="M0 0h21v15H0z" />
                  <path fill="#D52B1E" d="M0 0h21v8H0z" />
                </g>
              </svg>
              <span class="ml-2 text-gray-700 font-semibold">+62</span>
            </div>
            <input
              v-model="phoneNumber"
              type="tel"
              id="phone-input"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-200 focus:border-blue-500 block w-full pl-24 p-3.5"
              placeholder="Masukan no hp kamu"
            />
          </div>

          <button
            @click="registerViaWhatsApp"
            :disabled="!isPhoneValid || isLoading"
            type="button"
            class="mt-[1.618rem] w-full text-white font-medium rounded-lg text-base px-5 py-3 text-center transition-colors
                   bg-blue-600 hover:bg-blue-700
                   disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Mengarahkan...' : 'Daftar via WhatsApp' }}
          </button>

          <p class="mt-[2.618rem] text-sm text-gray-600">
            Sudah Punya Akun?
            <router-link
              to="/auth/login"
              class="font-bold text-blue-600 hover:underline"
              >Masuk Sekarang</router-link
            >
          </p>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Area ini seharusnya kosong atau hanya berisi CSS */
</style>