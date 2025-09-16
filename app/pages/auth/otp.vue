<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

definePageMeta({
  layout: "blanknav",
});

// --- STATE MANAGEMENT ---
const otp = ref(['', '', '', '', '', '']);
const inputRefs = ref([]);
const phoneNumber = ref('+62823-450-1192');
const timer = ref(30);
let timerInterval = null;

// State untuk logika baru
const isSuccess = ref(false); 
const isLoading = ref(false); 

// --- COMPUTED PROPERTIES ---
const formattedTimer = computed(() => {
  const seconds = String(timer.value).padStart(2, '0');
  return `(00:${seconds})`;
});
const isOtpComplete = computed(() => otp.value.every(val => val.match(/^\d$/)));

// --- METHODS ---
const handleInput = (index, event) => {
  const value = event.target.value;
  if (value.match(/^\d$/)) {
    if (index < otp.value.length - 1) {
      inputRefs.value[index + 1].focus();
    }
  } else {
    otp.value[index] = '';
  }
};

const handleBackspace = (index, event) => {
  if (event.key === 'Backspace' && index > 0 && !otp.value[index]) {
    inputRefs.value[index - 1].focus();
  }
};

const startTimer = () => {
  timerInterval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    } else {
      clearInterval(timerInterval);
    }
  }, 1000);
};

const resendOtp = async () => {
  console.log("Mengirim ulang OTP...");
  timer.value = 30;
  startTimer();
};

// --- LIFECYCLE HOOKS ---
onMounted(() => {
  startTimer();
  if (inputRefs.value[0]) {
    inputRefs.value[0].focus();
  }
});

onUnmounted(() => {
  clearInterval(timerInterval);
});

// --- FUNGSI UTAMA VERIFIKASI ---
const verifyOtp = async () => {
  if (!isOtpComplete.value || isLoading.value) return;

  const fullOtp = otp.value.join('');
  console.log(`Memverifikasi kode OTP: ${fullOtp}`);
  isLoading.value = true;

  try {
    // Simulasi API call yang butuh 1 detik dan berhasil
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Verifikasi API berhasil");
    
    isSuccess.value = true; 
    
    setTimeout(() => {
      navigateTo('/dashboard/membership/non-aktif');
    }, 1500);

  } catch (error) {
    console.error("Verifikasi OTP Gagal:", error);
    alert("Kode OTP yang Anda masukkan salah. Silakan coba lagi.");
  } finally {
    isLoading.value = false; 
  }
};
</script>

<template>
  <div v-if="isSuccess" class="w-screen min-h-screen bg-white flex flex-col justify-center items-center">
    <div class="w-full max-w-sm flex flex-col items-center text-center animate-pulse">
<img src="~/assets/images/success-check.svg" alt="Verifikasi Berhasil" class="w-40 h-40 mb-6" />
      <h1 class="text-2xl font-bold text-gray-800">
        Anda Berhasil Log In
      </h1>
    </div>
  </div>

  <div v-else class="bg-white md:bg-gray-50 min-h-screen flex flex-col md:justify-center md:items-center font-sans pt-8 md:pt-0">
    <div class="w-full md:max-w-md md:shadow-xl md:rounded-2xl md:bg-white flex flex-col">
      <header class="p-4 sm:p-6 flex items-center justify-between relative w-full flex-shrink-0">
        <router-link to="/auth/register" class="flex items-center text-gray-700 font-semibold z-10">
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
          <div class="flex justify-center mb-6">
            <div class="bg-blue-100 p-4 rounded-full">
              <img src="~/assets/images/otp-wa-logo.svg" alt="WhatsApp Icon" class="w-10 h-10" />
            </div>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
            Masukan Kode Verifikasi
          </h1>
          <p class="mt-2 text-sm sm:text-base text-gray-600">
            Untuk Masuk, masukan enam digit kode OTP yang akan kami kirim ke
            <strong class="font-bold text-gray-800">{{ phoneNumber }}</strong>
          </p>
          <div class="flex justify-center space-x-2 sm:space-x-3 my-8">
            <input
              v-for="index in 6"
              :key="index"
              :ref="el => { if (el) inputRefs[index - 1] = el }"
              v-model="otp[index - 1]"
              @input="handleInput(index - 1, $event)"
              @keydown="handleBackspace(index - 1, $event)"
              type="tel"
              maxlength="1"
              pattern="\d*"
              class="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>
          <p class="text-sm text-gray-600">
            Tidak terima kodenya?
            <button
              @click="resendOtp"
              :disabled="timer > 0 || isLoading"
              class="font-bold text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-wait"
            >
              Kirim Ulang <span v-if="timer > 0">{{ formattedTimer }}</span>
            </button>
          </p>
          <button
            @click="verifyOtp"
            :disabled="!isOtpComplete || isLoading"
            type="button"
            class="mt-6 w-full text-white bg-blue-600 font-medium rounded-lg text-base px-5 py-3 text-center transition-colors hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Memverifikasi...' : 'Verifikasi' }}
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Tidak ada style tambahan yang diperlukan. */
</style>