<script setup>
definePageMeta({
  layout: "blanknav",
});
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
              Jangan terlalu banyak milih, coba aja dulu!!!!
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
              type="tel"
              id="phone-input"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-24 p-3.5"
              placeholder="Masukan no hp kamu"
            />
          </div>

          <button
            type="button"
            class="mt-[1.618rem] w-full text-white bg-gray-400 font-medium rounded-lg text-base px-5 py-3 text-center hover:bg-gray-500 transition-colors"
          >
            Kirim OTP
          </button>

          <p class="mt-[1.618rem] text-sm text-gray-600">
            Sudah Punya Akun?
            <router-link
              to="/login"
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
/* Tidak ada style tambahan yang diperlukan. */
</style>
