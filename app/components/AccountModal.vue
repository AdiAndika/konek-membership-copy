<script setup>
import { ref } from 'vue';

defineProps({
  account: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['close']);

const copyStatus = ref({});

const copyToClipboard = async (text, field) => {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(String(text));
    Object.keys(copyStatus.value).forEach(key => {
      copyStatus.value[key] = 'Salin';
    });
    copyStatus.value[field] = 'Tersalin!';
    setTimeout(() => {
      copyStatus.value[field] = 'Salin';
    }, 2000);
  } catch (err) {
    console.error('Gagal menyalin teks: ', err);
    copyStatus.value[field] = 'Gagal';
  }
};
</script>

<template>
  <div
    class="relative z-50 flex flex-col bg-white rounded-t-2xl shadow-2xl w-full md:max-w-2xl lg:max-w-3xl"
    style="max-height: 90vh;"
  >
    <header class="relative flex-shrink-0 p-4 border-b border-gray-200 flex justify-center items-center">
      <h2 class="text-xl font-bold text-gray-800 text-center">
        Akun & Tutorial aktivasi
      </h2>
      <button
        @click="emit('close')"
        class="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800"
        aria-label="Tutup"
      >
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </header>

    <div class="overflow-y-auto p-6">
      <div class="mx-auto space-y-8">
        <div class="space-y-3">
          <h3 class="text-lg font-semibold text-gray-900">Info Akun</h3>
          <div class="border rounded-lg p-4 space-y-3 text-sm md:text-base">
            <div class="flex justify-between items-center gap-4">
              <span class="text-gray-600">Product</span>
              <span class="font-medium text-gray-900 text-right">{{ account.product }}</span>
            </div>
            <div class="flex justify-between items-center gap-4">
              <span class="text-gray-600">Email</span>
              <div class="flex items-center gap-2">
                <span class="font-medium text-gray-900 break-all">{{ account.email }}</span>
                <button @click="copyToClipboard(account.email, 'email')" class="text-blue-600 font-semibold hover:underline text-xs flex-shrink-0 px-2 py-1 rounded hover:bg-blue-50">
                  {{ copyStatus.email || 'Salin' }}
                </button>
              </div>
            </div>
            <div class="flex justify-between items-center gap-4">
              <span class="text-gray-600">Password</span>
              <div class="flex items-center gap-2">
                <span class="font-medium text-gray-900">{{ account.password }}</span>
                <button @click="copyToClipboard(account.password, 'password')" class="text-blue-600 font-semibold hover:underline text-xs flex-shrink-0 px-2 py-1 rounded hover:bg-blue-50">
                  {{ copyStatus.password || 'Salin' }}
                </button>
              </div>
            </div>
            <div v-if="account.profileName" class="flex justify-between items-center gap-4">
              <span class="text-gray-600">Nama Profile</span>
              <span class="font-medium text-gray-900">{{ account.profileName }}</span>
            </div>
            <div v-if="account.pin" class="flex justify-between items-center gap-4">
              <span class="text-gray-600">Kode PIN</span>
              <div class="flex items-center gap-2">
                <span class="font-medium text-gray-900">{{ account.pin }}</span>
                <button @click="copyToClipboard(account.pin, 'pin')" class="text-blue-600 font-semibold hover:underline text-xs flex-shrink-0 px-2 py-1 rounded hover:bg-blue-50">
                   {{ copyStatus.pin || 'Salin' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Tutorial Aktivasi</h3>
            <ol class="list-decimal list-inside text-gray-700 space-y-1.5 pl-1">
              <li v-for="(step, i) in account.tutorial" :key="`tut-${i}`">{{ step }}</li>
            </ol>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Ketentuan Pemakaian</h3>
            <h4 class="font-medium text-gray-800">Spesifikasi Produk</h4>
            <ol class="list-decimal list-inside text-gray-700 space-y-1.5 pl-1 mt-1">
              <li v-for="(term, i) in account.terms" :key="`term-${i}`">{{ term }}</li>
            </ol>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Konsekuensi Melanggar</h3>
            <ol class="list-decimal list-inside text-gray-700 space-y-1.5 pl-1">
              <li v-for="(con, i) in account.consequences" :key="`con-${i}`">{{ con }}</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>