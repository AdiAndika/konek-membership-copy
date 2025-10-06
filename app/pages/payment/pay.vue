<script setup lang="ts">
import { useRouter } from "vue-router";

// Buat state baru yang spesifik untuk halaman ini
// untuk menyimpan checkout link sementara.
const checkoutLink = useState("checkoutLink", () => null);
const router = useRouter();

// Jika halaman ini diakses tanpa ada checkout link (misal, akses langsung dari URL),
// kembalikan pengguna ke halaman checkout awal.
if (!checkoutLink.value) {
  console.warn("Checkout link tidak ditemukan, mengarahkan kembali.");
  router.replace("/payment/checkout");
}

const goToPayment = () => {
  if (checkoutLink.value) {
    window.location.href = checkoutLink.value;
  } else {
    alert("Link pembayaran tidak valid. Silakan coba lagi.");
    router.push("/payment/checkout");
  }
};

// Hapus link dari state setelah komponen dihancurkan
// agar tidak bisa diakses kembali dengan tombol 'back' di browser.
onUnmounted(() => {
  checkoutLink.value = null;
});
</script>

<template>
  <div
    class="bg-slate-50 min-h-screen flex items-center justify-center font-sans p-4"
  >
    <div
      class="max-w-sm w-full bg-white rounded-xl shadow-lg border p-8 text-center"
    >
      <div class="mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-16 h-16 mx-auto text-blue-500"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
          />
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-slate-800">
        Selesaikan Pembayaran Anda
      </h1>
      <p class="text-slate-500 mt-2">
        Anda akan diarahkan ke halaman pembayaran yang aman untuk menyelesaikan
        transaksi.
      </p>

      <div class="mt-8">
        <button
          @click="goToPayment"
          class="w-full bg-blue-600 text-white font-bold py-3 px-10 rounded-xl shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300"
        >
          Bayar Sekarang
        </button>
        <NuxtLink
          to="/payment/checkout"
          class="mt-4 inline-block text-sm text-slate-500 hover:text-slate-700"
        >
          Kembali
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");
.font-sans {
  font-family: "Inter", sans-serif;
}
</style>
