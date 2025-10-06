<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "~/services/api.js";
import { useAuth } from "~/composables/useState";

// --- State dari composables & router ---
interface AuthUser {
  id: number;
}
interface AuthState {
  user: AuthUser | null;
}
const auth = useAuth() as { value: AuthState };
const router = useRouter();
const route = useRoute();

// --- State lokal untuk proses pembayaran ---
const isProcessing = ref(false);
const paymentError = ref<string | null>(null);
const showInvoiceButtonOnError = ref(false);

// --- State global untuk menyimpan checkout link ---
const checkoutLink = useState("checkoutLink", () => null);

// --- Interface untuk tipe data paket ---
interface PackageDetail {
  id: number;
  name: string;
  subscription_type: "monthly" | "yearly" | string;
  duration: string;
  price: number;
}
const packageId = computed(() => (route.query.id as string) || "1");

// --- Fetching data detail paket dari API ---
const {
  data: apiResponse,
  pending,
  error,
} = await useAsyncData<{ data: PackageDetail }>(
  `package-detail-${packageId.value}`,
  () => api.getMembershipPackage(packageId.value)
);
const packageData = computed(() => apiResponse.value?.data);

// --- FUNGSI UTAMA: Logika untuk menangani pembayaran ---
async function handlePayment() {
  if (isProcessing.value) return;
  isProcessing.value = true;
  paymentError.value = null;
  showInvoiceButtonOnError.value = false;

  if (!auth.value.user) {
    paymentError.value = "Anda harus login terlebih dahulu.";
    isProcessing.value = false;
    return router.push("/auth/login");
  }

  try {
    const payload = {
      user_id: auth.value.user.id,
      membership_paket_id: packageId.value,
    };
    const orderResponse = await api.orderPackage(payload);

    // PERUBAHAN DI SINI
    if (orderResponse.data?.checkout_link) {
      // 1. Simpan link ke dalam state
      checkoutLink.value = orderResponse.data.checkout_link;
      // 2. Arahkan ke halaman /payment/pay
      router.push("/payment/pay");
    } else {
      throw new Error("Link pembayaran tidak valid.");
    }
  } catch (err: any) {
    console.error("Gagal memproses pembayaran:", err);
    paymentError.value =
      err.message || "Terjadi kesalahan saat memproses pembayaran.";
    if (err.message && err.message.includes("Terjadi Kesalahan Pada Server")) {
      showInvoiceButtonOnError.value = true;
    }
  } finally {
    isProcessing.value = false;
  }
}

// --- Computed Properties (Tidak ada perubahan) ---
const durationText = computed(() => {
  if (!packageData.value) return "";
  const type = packageData.value.subscription_type;
  return `${packageData.value.duration} ${
    type === "monthly" ? "Bulan" : "Tahun"
  }`;
});
const startDate = computed(() => new Date());
const endDate = computed(() => {
  if (!packageData.value) return new Date();
  const end = new Date(startDate.value);
  const duration = parseInt(packageData.value.duration, 10);
  if (packageData.value.subscription_type === "monthly") {
    end.setMonth(end.getMonth() + duration);
  } else {
    end.setFullYear(end.getFullYear() + duration);
  }
  return end;
});
const formatDate = (date: Date) => ({
  date: date.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
  time:
    date
      .toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(".", ":") + " pm",
});
const formattedStartDate = computed(() => formatDate(startDate.value));
const formattedEndDate = computed(() => formatDate(endDate.value));
const formattedPrice = computed(() => {
  if (!packageData.value) return "Rp 0,00";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
  }).format(packageData.value.price);
});
</script>

<template>
  <div class="bg-slate-50 min-h-screen font-sans">
    <main class="p-4 pt-8 max-w-md mx-auto">
      <div v-if="pending" class="text-center py-10 text-slate-500">
        <p>Memuat detail paket...</p>
      </div>
      <div
        v-else-if="error"
        class="text-center py-10 text-rose-500 bg-rose-50 p-4 rounded-lg border border-rose-200"
      >
        <p class="font-semibold">Gagal memuat data.</p>
        <p class="text-sm">{{ error.message }}</p>
      </div>

      <div v-else-if="packageData" class="space-y-5">
        <div
          class="bg-gradient-to-br from-blue-500 to-cyan-400 text-white rounded-2xl shadow-lg p-5 text-center relative overflow-hidden"
        >
          <p class="text-sm font-light opacity-80 mb-2">Paket Anda</p>
          <h1 class="text-2xl font-bold mb-4">{{ packageData.name }}</h1>
          <div class="flex justify-between items-center text-xs font-medium">
            <div class="text-left w-1/3">
              <p>{{ formattedStartDate.date }}</p>
              <p class="opacity-80">{{ formattedStartDate.time }}</p>
            </div>
            <div class="flex-shrink-0 relative pt-4">
              <div class="bg-white/90 rounded-full p-2 shadow-md">
                <div
                  class="bg-blue-600 rounded-full h-16 w-16 flex items-center justify-center"
                >
                  <svg
                    class="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div
                class="absolute top-0 left-1/2 -translate-x-1/2 bg-white/25 rounded-full px-3 py-1 text-xs backdrop-blur-sm"
              >
                {{ durationText }}
              </div>
            </div>
            <div class="text-right w-1/3">
              <p>{{ formattedEndDate.date }}</p>
              <p class="opacity-80">{{ formattedEndDate.time }}</p>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-xl shadow-md p-4 flex items-center justify-between border"
        >
          <div class="flex items-center space-x-3">
            <div class="bg-blue-50 text-blue-600 rounded-full p-2">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zm0 0v11m0-11h11m0 0v11m0-11L3 3m11 11L3 3"
                />
              </svg>
            </div>
            <p class="font-semibold text-slate-700">Masukan Kode Diskon</p>
          </div>
          <a
            href="#"
            class="text-sm font-medium text-slate-400 hover:text-slate-600"
            >Masukkan Kode</a
          >
        </div>

        <div class="bg-white rounded-xl shadow-md p-5 border">
          <h2 class="text-lg font-bold text-slate-800 mb-4">
            Rincian Pembelian
          </h2>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between text-slate-600">
              <p>Harga Paket</p>
              <p class="font-medium">{{ formattedPrice }}</p>
            </div>
            <div class="flex justify-between text-slate-600">
              <p>Diskon</p>
              <p class="font-medium">0%</p>
            </div>
            <div class="flex justify-between text-slate-500 text-xs">
              <p>Setelah Mendapatkan Diskon<br />& Penawaran Lainnya</p>
              <p class="font-medium self-end">{{ formattedPrice }}</p>
            </div>
          </div>
          <hr class="my-4 border-slate-200" />
          <div class="flex justify-between items-center">
            <p class="font-bold text-slate-800">Total Harga</p>
            <p class="text-xl font-extrabold text-blue-600">
              {{ formattedPrice }}
            </p>
          </div>
        </div>

        <div
          v-if="paymentError"
          class="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-lg shadow-sm"
        >
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 text-rose-500 pt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="w-5 h-5"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-rose-800">Gagal Membuat Pesanan</h3>
              <p class="text-sm text-rose-700 mt-1">{{ paymentError }}</p>
              <NuxtLink
                v-if="showInvoiceButtonOnError"
                to="/payment/invoices"
                class="mt-3 inline-block bg-slate-700 text-white font-bold py-2 px-5 rounded-lg text-sm hover:bg-slate-800 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
              >
                Lihat Riwayat Pembayaran
              </NuxtLink>
            </div>
          </div>
        </div>

        <div class="pt-4 flex items-center justify-between">
          <NuxtLink
            to="/dashboard/membership/non-aktif"
            class="text-rose-500 font-bold hover:text-rose-700 transition-colors"
            >Batalkan</NuxtLink
          >
          <a
            href="#"
            @click.prevent="handlePayment"
            :class="[
              'bg-blue-600 text-white font-bold py-3 px-10 rounded-xl shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300',
              { 'opacity-50 cursor-not-allowed': isProcessing },
            ]"
            :aria-disabled="isProcessing"
          >
            {{ isProcessing ? "Memproses..." : "Pembayaran" }}
          </a>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");
.font-sans {
  font-family: "Inter", sans-serif;
}
</style>
