<script setup>
// --- 1. Impor Modul dan Komponen ---
// Mengimpor semua fungsi dan komponen yang dibutuhkan dari Vue, Nuxt, dan file lokal.
import { ref, onMounted, computed } from "vue";
import { api } from "~/services/api";
import { useAuth } from "~/composables/useState";

// Komponen-komponen untuk membangun halaman dashboard
import DashboardLoadingSpinner from "~/components/LoadingSpinner.vue";
import SidebarStatus from "~/components/dashboard/SidebarStatus.vue";
import ProductList from "~/components/dashboard/ProductList.vue";
import InvoiceHistory from "~/components/dashboard/InvoiceHistory.vue";
import ContactCard from "~/components/dashboard/ContactCard.vue";
import NonActive from "~/components/dashboard/NonActive.vue";
import AccountModal from "~/components/dashboard/AccountModal.vue";
import { accountsData } from "~/data/accounts.js";

// Komponen-komponen notifikasi/modal
import PendingStatusModal from "~/components/notifikasi/PendingStatusModal.vue";
import ReminderPopup from "~/components/notifikasi/ReminderPopup.vue";
import AccountWaitingModal from "~/components/notifikasi/AccountWaitingModal.vue";

// --- 2. Konfigurasi Halaman dan Router ---
// Menentukan layout default untuk halaman ini.
definePageMeta({
  layout: "default",
});

// Menginisialisasi fungsionalitas router dan state autentikasi.
const auth = useAuth();
const router = useRouter();

// --- 3. State Management ---
// Mendefinisikan semua state reaktif yang akan digunakan di dalam komponen.

// Status membership: 'loading', 'active', 'pending', 'non-active'
const membershipStatus = ref("loading");
// Nama lengkap pengguna, diambil dari state autentikasi.
const userFullName = ref(auth.value.user?.full_name || "Pengguna");
// Detail membership (jika aktif).
const membershipDetails = ref(null);
// Daftar invoice/tagihan pengguna.
const invoices = ref([]);
// Daftar akun produk yang dimiliki pengguna.
const membershipAccounts = ref([]);
// Status loading untuk komponen ProductList dan InvoiceHistory.
const isLoadingProducts = ref(true);
const isLoadingInvoices = ref(true);
// Detail paket membership yang sedang aktif atau pending.
const packageDetails = ref(null);

// State untuk mengontrol visibilitas modal.
const showPendingModal = ref(false);
const showReminderPopup = ref(false);
const showAccountWaitingModal = ref(false);

// **[PERUBAHAN 1]** State untuk menyimpan invoice yang statusnya pending.
// Ini akan diteruskan ke komponen PendingStatusModal.
const pendingInvoice = ref(null);

// --- 4. Lifecycle Hook: onMounted ---
// Fungsi ini akan berjalan setelah komponen selesai dimuat di browser.
// Digunakan untuk mengambil data awal yang dibutuhkan halaman.
onMounted(async () => {
  // Jika pengguna tidak login, alihkan ke halaman login.
  if (!auth.value.user || !auth.value.user.id) {
    return router.push("/auth/login");
  }

  try {
    isLoadingProducts.value = true;
    isLoadingInvoices.value = true;

    // Mengambil detail membership dari API.
    const response = await api.getMembershipDetail(auth.value.user.id);
    const status = response.data?.status?.toLowerCase();
    membershipStatus.value = status || "non-active";

    // Jika status aktif, ambil daftar akun produk.
    if (status === "active") {
      membershipAccounts.value = response.data.pelanggan_membership_akun || [];
    }

    // Selalu ambil detail paket untuk mendapatkan daftar produk yang benar.
    if (response.data?.product_membership_id) {
      const packageResponse = await api.getMembershipPackage(
        response.data.product_membership_id
      );
      packageDetails.value = packageResponse.data;
    }

    // Logika spesifik berdasarkan status membership.
    if (status === "active") {
      membershipDetails.value = response.data;
      const invoiceResponse = await api.getInvoiceList(auth.value.user.id);
      invoices.value = invoiceResponse.data || [];

      // Cek sisa masa aktif untuk menampilkan notifikasi pengingat.
      if (response.data?.end_at) {
        const expiryDate = new Date(response.data.end_at);
        const today = new Date();
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 7 && diffDays > 0) {
          showReminderPopup.value = true;
        }
      }
      
      // Tampilkan modal jika akun sedang disiapkan.
      const totalProductsInPackage =
        packageDetails.value?.product_membership_paket?.length || 0;
      const preparedAccounts = membershipAccounts.value.length;
      if (preparedAccounts < totalProductsInPackage) {
        showAccountWaitingModal.value = true;
      }

    } else if (status === "pending") {
      const invoiceResponse = await api.getInvoiceList(auth.value.user.id);
      invoices.value = invoiceResponse.data || [];
      
      // **[PERUBAHAN 2]** Cari invoice yang pending dan simpan datanya.
      // Data ini akan digunakan oleh PendingStatusModal.
      pendingInvoice.value = invoices.value.find(
        (inv) =>
          (inv.status.toLowerCase() === "pending" ||
            inv.status.toLowerCase() === "menunggu") &&
          new Date(inv.due_date) > new Date()
      );

      // Jika ada invoice pending, tampilkan modal.
      if (pendingInvoice.value) {
        showPendingModal.value = true;
      }
    }
  } catch (error) {
    console.error("Gagal memeriksa status membership:", error);
    membershipStatus.value = "non-active";
  } finally {
    isLoadingProducts.value = false;
    isLoadingInvoices.value = false;
  }
});

// --- 5. Computed Properties ---
// Properti turunan yang nilainya dihitung berdasarkan state lain.

// Mengolah data produk untuk ditampilkan di ProductList.
const productListData = computed(() => {
  if (!packageDetails.value || !packageDetails.value.product_membership_paket) {
    return [];
  }

  const normalizeName = (name) =>
    name ? name.replace(/\s/g, "").toLowerCase() : "";

  return packageDetails.value.product_membership_paket.map((item) => {
    const apiProductName = item.paket_addon?.name;
    const imageUrl = item.paket_addon?.files?.[0]?.path_string;

    const staticProductName = Object.keys(accountsData).find((key) =>
      normalizeName(key).includes(normalizeName(apiProductName))
    );
    const staticData = accountsData[staticProductName];

    let ownedAccount = null;
    if (membershipStatus.value === "active") {
      ownedAccount = membershipAccounts.value.find((acc) => {
        const ownedApiProductName = acc.account_product?.paket_addon?.name;
        return (
          ownedApiProductName &&
          normalizeName(apiProductName) === normalizeName(ownedApiProductName)
        );
      });
    }

    return {
      title: staticProductName || apiProductName,
      image: imageUrl,
      isOwned: !!ownedAccount,
      apiData: { 
        owned: !!ownedAccount, 
        product: staticProductName || apiProductName,
        email: ownedAccount?.account_product?.email,
        password: ownedAccount?.account_product?.password,
        profileName: ownedAccount?.profile_name,
        pin: ownedAccount?.pin,
        link: ownedAccount?.link,
        alamat: ownedAccount?.alamat,
        tutorial: staticData?.tutorial,
        terms: staticData?.terms,
        consequences: staticData?.consequences,
        displayFields: staticData?.displayFields || (ownedAccount ? ['email', 'password'] : []),
      }
    };
  });
});

// State dan fungsi untuk modal detail akun.
const isModalOpen = ref(false);
const selectedAccount = ref(null);
const openAccountModal = (item) => {
    if (item && item.apiData) {
        selectedAccount.value = item.apiData;
        isModalOpen.value = true;
    }
};
const closeAccountModal = () => { isModalOpen.value = false; };
</script>

<template>
  <div>
    <div v-if="membershipStatus === 'loading'" class="flex justify-center items-center min-h-[60vh]">
      <DashboardLoadingSpinner />
    </div>

    <DashboardNonActive v-else-if="membershipStatus === 'non-active'" :user-full-name="userFullName" />
    
    <div v-else style="background: linear-gradient(180deg, #0080ff 0%, #fff 25%)">
      <div class="container mx-auto px-4 lg:px-8 py-8">
        <div class="lg:flex lg:gap-8 xl:gap-12">
          
          <DashboardSidebarStatus 
            :status="membershipStatus"
            :user-full-name="userFullName"
            :expiry-date="membershipDetails?.end_at"
            :pending-invoice="pendingInvoice"
          />
          
          <main class="lg:w-2/3 xl:w-3/4">
            <DashboardProductList 
              :status="membershipStatus"
              :products="productListData"
              :is-loading="isLoadingProducts"
              @open-modal="openAccountModal"
            />
            
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <DashboardInvoiceHistory 
                :invoices="invoices"
                :is-loading="isLoadingInvoices"
              />
              <ContactCard />
            </div>
          </main>
        </div>
      </div>
    </div>
    
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300 ease-out"
        leave-active-class="transition-opacity duration-200 ease-in"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-end justify-center">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeAccountModal"></div>
          <Transition
            appear
            enter-active-class="transition-transform duration-300 ease-out"
            leave-active-class="transition-transform duration-200 ease-in"
            enter-from-class="translate-y-full"
            enter-to-class="translate-y-0"
            leave-from-class="translate-y-0"
            leave-to-class="translate-y-full"
          >
            <AccountModal
              v-if="selectedAccount"
              :account="selectedAccount"
              @close="closeAccountModal"
            />
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200 ease-out"
        leave-active-class="transition-opacity duration-200 ease-in"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <PendingStatusModal
          v-if="showPendingModal"
          :invoice="pendingInvoice" 
          @close="showPendingModal = false"
        />
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300 ease-out"
        leave-active-class="transition-opacity duration-200 ease-in"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <ReminderPopup
          v-if="showReminderPopup && membershipDetails"
          :expiry-date="membershipDetails.end_at"
          @close="showReminderPopup = false"
        />
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200 ease-out"
        leave-active-class="transition-opacity duration-200 ease-in"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <AccountWaitingModal
          v-if="showAccountWaitingModal"
          @close="showAccountWaitingModal = false"
        />
      </Transition>
    </Teleport>
  </div>
</template>