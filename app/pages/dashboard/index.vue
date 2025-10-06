<script setup>
import { ref, onMounted, computed } from 'vue';
import { api } from '~/services/api';
import { useAuth } from '~/composables/useState';

// Import komponen-komponen yang dibutuhkan
import DashboardLoadingSpinner from '~/components/LoadingSpinner.vue';
import SidebarStatus from '~/components/dashboard/SidebarStatus.vue';
import ProductList from '~/components/dashboard/ProductList.vue';
import InvoiceHistory from '~/components/dashboard/InvoiceHistory.vue';
import ContactCard from '~/components/dashboard/ContactCard.vue';
import NonActive from '~/components/dashboard/NonActive.vue';
import AccountModal from '~/components/dashboard/AccountModal.vue';
import { accountImages, accountsData } from '~/data/accounts.js';
// Impor modal notifikasi yang baru
import PendingStatusModal from '~/components/notifikasi/PendingStatusModal.vue';


definePageMeta({
  layout: "default",
});

const auth = useAuth();
const router = useRouter();
const route = useRoute();

// --- STATES ---
const membershipStatus = ref('loading');
const userFullName = ref(auth.value.user?.full_name || 'Pengguna');
const membershipDetails = ref(null);
const invoices = ref([]);
const membershipAccounts = ref([]);
const isLoadingProducts = ref(true);
const isLoadingInvoices = ref(true);
const loadError = ref(null);

const showPendingModal = ref(false);
const modalType = ref('pending');


// --- API CALLS & LIFECYCLE HOOKS ---
onMounted(async () => {
  if (!auth.value.user || !auth.value.user.id) {
    return router.push('/auth/login');
  }

  const hasSeenNotification = sessionStorage.getItem('hasSeenPendingNotification');

  try {
    const response = await api.getMembershipDetail(auth.value.user.id);
    const status = response.data?.status?.toLowerCase();

    if (status === 'active') {
      membershipStatus.value = 'active';
      membershipDetails.value = response.data;
      membershipAccounts.value = response.data.pelanggan_membership_akun || [];
      const invoiceResponse = await api.getInvoiceList(auth.value.user.id);
      invoices.value = invoiceResponse.data || [];

    } else if (status === 'pending') {
      membershipStatus.value = 'pending';
      const invoiceResponse = await api.getInvoiceList(auth.value.user.id);
      invoices.value = invoiceResponse.data || [];

      if (!hasSeenNotification) {
        // --- MODIFIKASI LOGIKA NOTIFIKASI ---
        const pendingInvoice = invoices.value.find(inv => 
          inv.status.toLowerCase() === 'pending' && new Date(inv.due_date) > new Date()
        );
        const expiredPendingInvoice = invoices.value.find(inv =>
          inv.status.toLowerCase() === 'pending' && new Date(inv.due_date) < new Date()
        );

        if (route.query.status === 'success') {
          modalType.value = 'success';
          showPendingModal.value = true;
          router.replace({ query: {} });
        } else if (pendingInvoice) {
          modalType.value = 'pending';
          showPendingModal.value = true;
        } else if (expiredPendingInvoice) {
          // Tambahkan kondisi ini untuk invoice kedaluwarsa
          modalType.value = 'expired';
          showPendingModal.value = true;
        }
        
        sessionStorage.setItem('hasSeenPendingNotification', 'true');
      }

    } else {
      membershipStatus.value = 'non-active';
    }
  } catch (error) {
    console.error("Gagal memeriksa status membership:", error);
    membershipStatus.value = 'non-active';
  } finally {
    isLoadingProducts.value = false;
    isLoadingInvoices.value = false;
  }
});


// ... (computed properties biarkan sama) ...
const productListData = computed(() => {
  if (membershipStatus.value === 'pending') {
    return [
      { title: "Netflix Premium", image: "/images/netflix.png" },
      { title: "Spotify Premium", image: "/images/spotify.png" },
      { title: "VIU Premium", image: "/images/viu_full.png" },
      { title: "WeTV Premium", image: "/images/wetv.png" },
    ];
  }
  if (membershipStatus.value === 'active') {
    const allPossibleProducts = Object.keys(accountsData);
    return allPossibleProducts.map(productName => {
      const ownedAccount = membershipAccounts.value.find(
        acc => acc.account_product?.paket_addon?.name === productName
      );
      const staticData = accountsData[productName];
      return {
        title: productName,
        image: accountImages[productName] || '/images/default.png',
        isOwned: !!ownedAccount,
        apiData: ownedAccount ? {
          owned: true, product: productName,
          email: ownedAccount.account_product?.email,
          password: ownedAccount.account_product?.password,
          profileName: ownedAccount.account_profile?.name,
          pin: ownedAccount.pin,
          tutorial: staticData.tutorial,
          terms: staticData.terms,
          consequences: staticData.consequences,
        } : { owned: false, product: productName }
      };
    });
  }
  return [];
});

// --- MODAL LOGIC ---
const isModalOpen = ref(false);
const selectedAccount = ref(null);
const openAccountModal = (item) => {
  if (item && item.apiData) {
    selectedAccount.value = item.apiData;
    isModalOpen.value = true;
  }
};
const closeAccountModal = () => { isModalOpen.value = false; };

// --- MODIFIKASI: Ganti nama dan sesuaikan logika ---
const handleModalAction = () => {
  showPendingModal.value = false; // Selalu tutup modal setelah aksi

  if (modalType.value === 'pending') {
    const pendingInvoice = invoices.value.find(inv => 
      inv.status.toLowerCase() === 'pending' && new Date(inv.due_date) > new Date()
    );
    if (pendingInvoice) {
      checkoutState.value = {
        totalAmount: pendingInvoice.amount,
        paymentUrl: pendingInvoice.payment_url,
        expiryDate: pendingInvoice.due_date,
      };
      router.push('/payment/checkout');
    }
  } else if (modalType.value === 'expired') {
    checkoutState.value = null;
    router.push('/payment/checkout');
  }
};
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
              <DashboardContactCard />
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
          :type="modalType"
          @close="showPendingModal = false"
          @action="handleModalAction"
        />
      </Transition>
    </Teleport>

  </div>
</template>