<template>
  <header class="shadow-sm">
    <div class="px-4 lg:px-12 py-3">
      <div class="flex justify-between items-center">
        <router-link to="/">
          <img class="h-10" src="~/assets/images/logo-konek-biru.png" alt="Logo" />
        </router-link>

        <router-link to="/auth/login" class="text-white font-black py-2 px-6 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 hover:shadow-lg hover:opacity-90 transition-all duration-300">
          LOGIN
        </router-link>
      </div>
    </div>
  </header>
</template>