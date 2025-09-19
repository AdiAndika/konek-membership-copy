<script setup>
import { ref, computed } from 'vue';
import { api } from '~/services/api';
import { usePhoneNumber } from '~/composables/useState';

definePageMeta({
  layout: "blanknav",
});

const phoneNumberState = usePhoneNumber();
const phoneNumber = ref('');
const isPhoneValid = computed(() => phoneNumber.value.length > 8);
const isLoading = ref(false);
const errorMessage = ref('');

const handleInput = () => {
  errorMessage.value = '';
};

const login = async () => {
  if (!isPhoneValid.value || isLoading.value) return;

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await api.checkUserNumber(phoneNumber.value);

    // Pemeriksaan eksplisit terhadap pesan sukses dari API
    if (response && response.message === 'Otp Berhasil di generate') {
      console.log('Respon API Sukses:', response.message);
      
      // Simpan nomor telepon dan lanjutkan ke halaman OTP
      phoneNumberState.value = phoneNumber.value;
      navigateTo('/auth/otp');
    } else {
      // Jika pesan tidak sesuai, anggap sebagai error dan lempar pesan tersebut
      throw new Error(response.message || 'Terjadi kesalahan yang tidak diketahui');
    }

  } catch (error) {
    console.error("Login Gagal:", error);
    // Tampilkan pesan error apa pun di halaman, termasuk "Nomor belum terdaftar"
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="bg-white md:bg-gray-50 min-h-screen flex flex-col md:justify-center md:items-center font-sans pt-8 md:pt-0">
    <div class="w-full md:max-w-md md:shadow-xl md:rounded-2xl md:bg-white flex flex-col">
      <header class="p-4 sm:p-6 flex items-center justify-between relative w-full flex-shrink-0">
        <router-link to="/" class="flex items-center text-gray-700 font-semibold z-10">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Kembali
        </router-link>
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <img src="~/assets/images/logo-konek-biru.png" alt="Konek.id Logo" class="h-8" />
        </div>
      </header>
      <main class="flex-grow flex flex-col items-center text-center px-[1.618rem] sm:px-[2.618rem] pt-[1.618rem] pb-[4.236rem]">
        <div class="w-full max-w-sm">
          <div class="mb-[2.618rem]">
            <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              Selamat Datang Para Pencari Hiburan Digital
            </h1>
            <p class="mt-2 text-sm sm:text-base text-gray-600">
              Jangan terlalu banyak milih, coba aja dulu!!!!
            </p>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold mb-[1.618rem]">
            Masuk Akun
          </h2>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
              @input="handleInput"
              type="tel"
              id="phone-input"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-200 focus:border-blue-500 block w-full pl-24 p-3.5"
              placeholder="Masukan no hp kamu"
            />
          </div>
          
          <p v-if="errorMessage" class="text-red-500 text-sm mt-2">
            {{ errorMessage }}
          </p>

          <button
            @click="login"
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
            {{ isLoading ? 'Memproses...' : 'Kirim Kode OTP' }}
          </button>
          <p class="mt-[1.618rem] text-sm text-gray-600">
            Belum Punya Akun?
            <router-link to="/auth/register" class="font-bold text-blue-600 hover:underline">
              Daftar Gratis
            </router-link>
          </p>
        </div>
      </main>
    </div>
  </div>
</template>