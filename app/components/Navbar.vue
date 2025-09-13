<script setup>
import { ref } from "vue";

const isOpen = ref(false);
</script>

<template>
  <header>
    <div class="container px-4 lg:px-12 py-3">
      <div class="flex justify-between items-center">
        <a href="/">
          <img class="h-10" src="~/assets/images/logo-konek-biru.png" alt="" />
        </a>
        <div class="flex items-center gap-3">
          <a class="hidden lg:block" href="/auth/login">
            <button
              id="login"
              class="text-white font-bold text-lg py-1.5 px-10 rounded-full transition-colors"
            >
              Login
            </button>
          </a>
          <button class="lg:hidden p-2" @click="isOpen = !isOpen">
            <svg
              v-if="!isOpen"
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6 text-gray-800"
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
        </div>
      </div>

      <!-- Mobile Menu -->
      <div
        v-if="isOpen"
        class="lg:hidden flex flex-col gap-4 mt-3 bg-white rounded-lg shadow px-6 py-4"
      >
        <a href="/" class="hover:text-blue-500 transition">Beranda</a>
        <a href="/auth/login">
          <button
            id="login"
            class="w-full text-white font-bold text-lg py-1 px-8 rounded-full transition-colors"
          >
            Login
          </button>
        </a>
        <a href="" class="hover:text-blue-500 transition">Profile</a>
        <a href="" class="hover:text-red-500 transition">Logout</a>
      </div>
    </div>
  </header>
</template>
