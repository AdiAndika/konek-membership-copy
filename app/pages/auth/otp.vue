<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { api } from '~/services/api';
import { usePhoneNumber } from '~/composables/useState';
import { useAuth } from '~/composables/useState';

definePageMeta({
  layout: "blanknav",
});

const auth = useAuth();
const phoneNumberState = usePhoneNumber();
const otp = ref(['', '', '', '', '', '']);
const inputRefs = ref([]);
const timer = ref(300);
let timerInterval = null;

const isSuccess = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const formattedTimer = computed(() => {
  const minutes = Math.floor(timer.value / 60);
  const seconds = timer.value % 60;
  return `(${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')})`;
});

const isOtpComplete = computed(() => otp.value.every(val => val.match(/^\d$/)));

const handleInput = (index, event) => {
  errorMessage.value = '';
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
  errorMessage.value = '';
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
  if (!phoneNumberState.value) return;
  console.log("Mengirim ulang OTP...");
  timer.value = 300;
  startTimer();
  try {
    await api.checkUserNumber(phoneNumberState.value);
  } catch (error) {
    console.error("Gagal mengirim ulang OTP:", error);
    errorMessage.value = error.message || "Gagal mengirim ulang OTP.";
  }
};

onMounted(() => {
  startTimer();
  if (inputRefs.value[0]) {
    inputRefs.value[0].focus();
  }
});

onUnmounted(() => {
  clearInterval(timerInterval);
});

const verifyOtp = async () => {
  if (!isOtpComplete.value || isLoading.value || !phoneNumberState.value) return;

  const fullOtp = otp.value.join('');
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await api.verifyOtp(phoneNumberState.value, fullOtp);
    console.log("Verifikasi API berhasil", response);

    if (response.data && response.api && response.api.access_token) {
      const userToStore = {
        id: response.data.id,
        full_name: response.data.full_name,
        email: response.data.email,
        phone: response.data.phone,
      };

      auth.value = {
        user: userToStore,
        token: response.api.access_token,
      };
      
      isSuccess.value = true; 

      setTimeout(() => {
        navigateTo('/dashboard/membership/non-aktif');
      }, 1500);

    } else {
      throw new Error('Format respons dari server tidak valid.');
    }

  } catch (error) {
    console.error("Verifikasi OTP Gagal:", error);
    errorMessage.value = error.message || "Kode OTP tidak sesuai atau sudah kedaluwarsa.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div v-if="isSuccess" class="fixed inset-0 bg-white flex flex-col justify-center items-center">
    <Transition
      appear
      enter-active-class="transition-opacity duration-500 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
    >
      <div class="w-full max-w-sm flex flex-col items-center text-center">
        <img src="~/assets/images/success-check.png" alt="Verifikasi Berhasil" class="w-40 h-40 mb-6" />
        <h1 class="text-2xl font-bold text-gray-800">
          Anda Berhasil Log In
        </h1>
      </div>
    </Transition>
  </div>

  <div v-else class="bg-white md:bg-gray-50 min-h-screen flex flex-col md:justify-center md:items-center font-sans pt-8 md:pt-0">
    <div class="w-full md:max-w-md md:shadow-xl md:rounded-2xl md:bg-white flex flex-col">
       <header class="p-4 sm:p-6 flex items-center justify-between relative w-full flex-shrink-0">
         <router-link to="/auth/login" class="flex items-center text-gray-700 font-semibold z-10">
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
             <strong class="font-bold text-gray-800">+62{{ phoneNumberState }}</strong>
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
           <p v-if="errorMessage" class="text-red-500 text-sm mb-4">
             {{ errorMessage }}
           </p>
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