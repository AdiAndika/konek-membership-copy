<script setup>
// --- 1. Impor Modul dan Komponen ---
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
import ExpiredStatusModal from '~/components/notifikasi/ExpiredStatusModal.vue';


// --- 2. Konfigurasi Halaman dan Router ---
definePageMeta({
  layout: "default",
});

const auth = useAuth();
const router = useRouter();

// --- 3. State Management ---
const membershipStatus = ref("loading");
const userFullName = ref(auth.value.user?.full_name || "Pengguna");
const membershipDetails = ref(null);
const invoices = ref([]);
const membershipAccounts = ref([]);
const isLoadingProducts = ref(true);
const isLoadingInvoices = ref(true);
const packageDetails = ref(null);

// State untuk mengontrol visibilitas modal.
const showPendingModal = ref(false);
const showReminderPopup = ref(false);
const showAccountWaitingModal = ref(false);
const showExpiredModal = ref(false);

const pendingInvoice = ref(null);
const expiredInvoice = ref(null);


// --- 4. Lifecycle Hook: onMounted (DENGAN LOGIKA BARU) ---
onMounted(async () => {
  if (!auth.value.user || !auth.value.user.id) {
    return router.push("/auth/login");
  }

  try {
    isLoadingProducts.value = true;
    isLoadingInvoices.value = true;

    // 1. Ambil detail membership utama
    const response = await api.getMembershipDetail(auth.value.user.id);
    membershipDetails.value = response.data;

    let status = membershipDetails.value?.status?.toLowerCase();
    const endDateString = membershipDetails.value?.end_at;

    // 2. Logika utama: Tentukan apakah sudah expired, ini akan menimpa status dari API
    if (endDateString) {
      const expiryDate = new Date(endDateString);
      if (expiryDate.getTime() < new Date().getTime()) {
        status = 'expired';
      }
    }

    // Atur status final untuk UI
    membershipStatus.value = status || "nonactive";

    // 3. Ambil data tambahan berdasarkan status final
    if (membershipStatus.value === 'active' || membershipStatus.value === 'expired') {
        if (membershipDetails.value.product_membership_id) {
            const packageResponse = await api.getMembershipPackage(
                membershipDetails.value.product_membership_id
            );
            packageDetails.value = packageResponse.data;
        }
    }

    // Ambil histori invoice jika pengguna bukan pengguna baru (nonactive sejati)
    if (membershipStatus.value !== 'nonactive') {
        const invoiceResponse = await api.getInvoiceList(auth.value.user.id);
        invoices.value = invoiceResponse.data || [];
    }

    // 4. Jalankan logika spesifik per status (seperti menampilkan pop-up)
    if (membershipStatus.value === 'active') {
        membershipAccounts.value = membershipDetails.value.pelanggan_membership_akun || [];
        const expiryDate = new Date(endDateString);
        const today = new Date();
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 7 && diffDays > 0) {
            showReminderPopup.value = true;
        }
        
        const totalProductsInPackage = packageDetails.value?.product_membership_paket?.length || 0;
        const preparedAccounts = membershipAccounts.value.length;
        if (preparedAccounts < totalProductsInPackage) {
            showAccountWaitingModal.value = true;
        }

    } else if (membershipStatus.value === 'pending') {
        pendingInvoice.value = invoices.value.find(
            (inv) => (inv.status.toLowerCase() === 'pending' || inv.status.toLowerCase() === 'menunggu') && new Date(inv.due_date) > new Date()
        );

        if (pendingInvoice.value) {
            showPendingModal.value = true;
        } else {
            expiredInvoice.value = invoices.value.find((inv) => inv.status.toLowerCase() === 'expired');
            if (expiredInvoice.value) {
                showExpiredModal.value = true;
            }
        }
    }

  } catch (error) {
    console.error("Gagal memeriksa status membership:", error);
    // Jika API gagal (misal 404 karena tidak ada data), anggap sebagai non-aktif
    membershipStatus.value = "nonactive";
  } finally {
    isLoadingProducts.value = false;
    isLoadingInvoices.value = false;
  }
});


// --- 5. Computed Properties (Disederhanakan) ---
const productListData = computed(() => {
    // Logika ini sekarang lebih sederhana karena kita sudah memastikan packageDetails diisi untuk status active & expired
    if (!packageDetails.value?.product_membership_paket) {
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

const dashboardStyle = computed(() => {
  if (membershipStatus.value === 'active') {
    return { background: 'linear-gradient(180deg, #0080ff 0%, #fff 25%)' };
  }
  if (membershipStatus.value === 'pending') {
    return { background: 'linear-gradient(180deg, #F8A902 0%, #fff 25%)' };
  }
  if (membershipStatus.value === 'expired') {
    return { background: 'linear-gradient(180deg, #6B7280 0%, #fff 25%)' };
  }
  return {};
});

const isModalOpen = ref(false);
const selectedAccount = ref(null);
const openAccountModal = (item) => {
    // Hanya izinkan buka modal jika status 'active'
    if (membershipStatus.value === 'active' && item && item.apiData) {
        selectedAccount.value = item.apiData;
        isModalOpen.value = true;
    }
};
const closeAccountModal = () => { isModalOpen.value = false; };

// Fungsi ini akan dipanggil dari SidebarStatus saat "Pilih Paket Lain" diklik
const handleChangePackage = () => {
  membershipStatus.value = 'nonactive';
};
</script>

<template>
  <div>
    <div v-if="membershipStatus === 'loading'" class="flex justify-center items-center min-h-[60vh]">
      <DashboardLoadingSpinner />
    </div>

    <NonActive 
      v-else-if="membershipStatus === 'nonactive'" 
      :user-full-name="userFullName"
      :invoices="invoices" 
    />
    
    <div v-else :style="dashboardStyle">
      <div class="container mx-auto px-4 lg:px-8 py-8">
        <div class="lg:flex lg:gap-8 xl:gap-12">
          
          <SidebarStatus 
            :status="membershipStatus"
            :user-full-name="userFullName"
            :expiry-date="membershipDetails?.end_at"
            :pending-invoice="pendingInvoice"
            :package-id="membershipDetails?.product_membership_id"
            :package-name="packageDetails?.name || membershipDetails?.product_membership?.name"
            @change-package="handleChangePackage"
          />
          
          <main class="lg:w-2/3 xl:w-3/4">
            <ProductList 
              :status="membershipStatus"
              :products="productListData"
              :is-loading="isLoadingProducts"
              @open-modal="openAccountModal"
            />
            
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <InvoiceHistory 
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

    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200 ease-out"
        leave-active-class="transition-opacity duration-200 ease-in"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <ExpiredStatusModal
          v-if="showExpiredModal"
          :invoice="expiredInvoice"
          :user-full-name="userFullName"
          @close="showExpiredModal = false"
        />
      </Transition>
    </Teleport>
  </div>
</template>