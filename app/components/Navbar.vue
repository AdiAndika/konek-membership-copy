<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from '~/composables/useState'; // 1. Import state autentikasi

const route = useRoute();
const router = useRouter();
const auth = useAuth(); // 2. Panggil state autentikasi

// 3. Ganti `isLoggedIn` menjadi computed property yang memeriksa token
const isLoggedIn = computed(() => !!auth.value.token); 
const isOpen = ref(false);

// 4. Buat fungsi logout
const logout = () => {
  // Hapus cookie autentikasi
  auth.value = { user: null, token: null };
  // Arahkan ke halaman login
  router.push('/');
};
</script>

<template>
  <header class="shadow-sm relative">
    <div>
      <div class="flex justify-between items-center px-4 lg:px-12 py-3">
        <router-link to="/">
          <img class="h-10" src="~/assets/images/logo-konek-biru.png" alt="Logo" />
        </router-link>

        <div>
          <nav class="hidden lg:flex items-center gap-8">
            <template v-if="isLoggedIn">
              <router-link to="/dashboard/membership/aktif" class="font-semibold text-gray-700 hover:text-blue-500 transition">Beranda</router-link>
              <router-link to="/profile/edit" class="font-semibold text-gray-700 hover:text-blue-500 transition">Profile</router-link>
              <button @click="logout" class="font-semibold text-gray-700 hover:text-red-500 transition">Logout</button>
            </template>
            <template v-else>
              <router-link to="/auth/login" class="text-white font-black py-2 px-6 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 hover:shadow-lg hover:opacity-90 transition-all duration-300">
                LOGIN
              </router-link>
            </template>
          </nav>

          <div class="lg:hidden">
            <button v-if="isLoggedIn" @click="isOpen = !isOpen" class="w-8 h-8 flex flex-col justify-center items-center gap-1.5 z-50 transition-transform duration-300 ease-in-out" :class="isOpen ? 'rotate-90' : ''">
              <span class="block w-6 h-0.5 bg-gray-800"></span>
              <span class="block w-6 h-0.5 bg-gray-800"></span>
              <span class="block w-6 h-0.5 bg-gray-800"></span>
            </button>
            <router-link v-else to="/auth/login" class="text-white font-black py-2 px-6 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 hover:shadow-lg hover:opacity-90 transition-all duration-300">
              LOGIN
            </router-link>
          </div>
        </div>
      </div>
    </div>
    
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 -translate-y-2"
      enter-to-class="transform opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="transform opacity-100 translate-y-0"
      leave-to-class="transform opacity-0 -translate-y-2"
    >
      <div v-if="isOpen && isLoggedIn" class="lg:hidden flex flex-col bg-white shadow-lg absolute w-full left-0 divide-y divide-gray-200">
        <router-link to="/dashboard/membership/aktif" @click="isOpen = false" class="font-semibold text-gray-700 hover:text-blue-500 transition px-4 py-3">Beranda</router-link>
        <router-link to="/profile/edit" @click="isOpen = false" class="font-semibold text-gray-700 hover:text-blue-500 transition px-4 py-3">Profile</router-link>
        <button @click="logout" class="text-left font-semibold text-red-500 hover:text-red-600 transition px-4 py-3">Logout</button>
      </div>
    </Transition>
  </header>
</template>