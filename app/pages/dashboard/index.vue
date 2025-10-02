<script setup>
import { ref, onMounted, computed } from 'vue';
import { api } from '~/services/api';
import { useAuth } from '~/composables/useState';

// Import komponen baru
import DashboardLoadingSpinner from '~/components/dashboard/LoadingSpinner.vue';
import SidebarStatus from '~/components/dashboard/SidebarStatus.vue';
import ProductList from '~/components/dashboard/ProductList.vue';
import InvoiceHistory from '~/components/dashboard/InvoiceHistory.vue';
import ContactCard from '~/components/dashboard/ContactCard.vue';
import NonActive from '~/components/dashboard/NonActive.vue';
import AccountModal from '~/components/dashboard/AccountModal.vue';
import { accountImages, accountsData } from '~/data/accounts.js';

definePageMeta({
  layout: "default",
});

const auth = useAuth();
const router = useRouter();

// --- STATES ---
const membershipStatus = ref('loading');
const userFullName = ref(auth.value.user?.full_name || 'Pengguna');
const membershipDetails = ref(null);
const invoices = ref([]);
const membershipAccounts = ref([]);
const isLoadingProducts = ref(true);
const isLoadingInvoices = ref(true);
const loadError = ref(null);

// --- API CALLS ---
onMounted(async () => {
  if (!auth.value.user || !auth.value.user.id) {
    return router.push('/auth/login');
  }

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


// --- COMPUTED PROPERTIES FOR PRODUCT LIST ---
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
  </div>
</template>