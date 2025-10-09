<script setup>
import { ref } from "vue";
import { ADMIN_WHATSAPP_NUMBER } from "~/utils/constants";

definePageMeta({
  layout: "blanknav",
});

const isLoading = ref(false);

// Fungsi disederhanakan: tidak lagi memerlukan validasi nomor telepon
const registerViaWhatsApp = () => {
  // Mencegah klik ganda saat sedang loading
  if (isLoading.value) return;

  isLoading.value = true;
  const message = encodeURIComponent(`Membership Register\nUsername:\nEmail:`);

  const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${message}`;
  setTimeout(() => {
    window.open(whatsappUrl, "_blank");
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
            <!-- Teks deskripsi diubah -->
            <p class="mt-2 text-sm sm:text-base text-gray-600">
              Klik tombol di bawah ini untuk memulai pendaftaran melalui
              WhatsApp.
            </p>
          </div>

          <!-- Input nomor telepon dihapus -->

          <button
            @click="registerViaWhatsApp"
            :disabled="isLoading"
            type="button"
            class="w-full text-white font-medium rounded-lg text-base px-5 py-3 text-center transition-colors bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-wait flex justify-center items-center"
          >
            <svg
              v-if="isLoading"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <!-- PERUBAHAN DI SINI: Logo WA dihapus -->
            <span>{{
              isLoading ? "Mengarahkan..." : "Daftar via WhatsApp"
            }}</span>
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
