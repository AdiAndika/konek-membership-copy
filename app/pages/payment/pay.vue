<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { usePaymentState } from "~/composables/usePaymentState";
import { useRouter } from "vue-router";

definePageMeta({
  layout: "blanknav",
});

const paymentState = usePaymentState();
const router = useRouter();

onMounted(() => {
  if (!paymentState.value?.link) {
    router.replace("/payment/checkout");
  }
});

const now = ref(new Date());
let timerInterval: any = null;

const timeLeft = computed(() => {
  if (!paymentState.value?.expiry) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const expiryDate = new Date(paymentState.value.expiry);
  const diff = expiryDate.getTime() - now.value.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
});

onMounted(() => {
  timerInterval = setInterval(() => {
    now.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});

const padZero = (num: number) => num.toString().padStart(2, "0");
</script>

<template>
  <div
    class="bg-slate-50 flex items-center justify-center min-h-screen font-sans p-4"
  >
    <div
      v-if="paymentState?.link"
      class="w-full max-w-md text-center bg-white p-8 rounded-2xl shadow-xl border"
    >
      <h1 class="text-3xl font-bold text-slate-800">
        Selesaikan Pembayaran Anda
      </h1>
      <p class="mt-3 text-slate-600">
        Anda akan diarahkan ke halaman pembayaran. Mohon selesaikan transaksi
        sebelum waktu habis.
      </p>

      <div class="my-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p class="text-sm font-semibold text-blue-700">
          Batas Waktu Pembayaran:
        </p>
        <div class="flex justify-center items-center gap-2 mt-2">
          <div v-if="timeLeft.days > 0" class="text-center">
            <div class="text-4xl font-bold text-slate-800">
              {{ padZero(timeLeft.days) }}
            </div>
            <div class="text-xs text-slate-500">Hari</div>
          </div>
          <div
            v-if="timeLeft.days > 0"
            class="text-4xl font-light text-slate-300"
          >
            :
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-slate-800">
              {{ padZero(timeLeft.hours) }}
            </div>
            <div class="text-xs text-slate-500">Jam</div>
          </div>
          <div class="text-4xl font-light text-slate-300">:</div>
          <div class="text-center">
            <div class="text-4xl font-bold text-slate-800">
              {{ padZero(timeLeft.minutes) }}
            </div>
            <div class="text-xs text-slate-500">Menit</div>
          </div>
          <div class="text-4xl font-light text-slate-300">:</div>
          <div class="text-center">
            <div class="text-4xl font-bold text-slate-800">
              {{ padZero(timeLeft.seconds) }}
            </div>
            <div class="text-xs text-slate-500">Detik</div>
          </div>
        </div>
      </div>

      <a
        :href="paymentState.link"
        class="w-full inline-block bg-blue-600 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:bg-blue-700"
      >
        Bayar Sekarang
      </a>

      <!-- PERUBAHAN DI SINI: Tombol kembali ditambahkan -->
      <NuxtLink
        to="/payment/checkout"
        class="mt-4 inline-block text-sm text-slate-500 hover:text-slate-700"
      >
        Kembali ke Detail Paket
      </NuxtLink>
    </div>
    <div v-else>
      <p>Mengarahkan kembali...</p>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");
.font-sans {
  font-family: "Inter", sans-serif;
}
</style>
