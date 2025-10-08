<script setup>
import { ref, onMounted, computed } from 'vue';
import { api } from '~/services/api';
import { useAuth } from '~/composables/useState';

// Import komponen-komponen
import DashboardLoadingSpinner from '~/components/LoadingSpinner.vue';
import SidebarStatus from '~/components/dashboard/SidebarStatus.vue';
import ProductList from '~/components/dashboard/ProductList.vue';
import InvoiceHistory from '~/components/dashboard/InvoiceHistory.vue';
import ContactCard from '~/components/dashboard/ContactCard.vue';
import NonActive from '~/components/dashboard/NonActive.vue';
import AccountModal from '~/components/dashboard/AccountModal.vue';
import { accountsData } from '~/data/accounts.js';
import PendingStatusModal from '~/components/notifikasi/PendingStatusModal.vue';
import ReminderPopup from '~/components/notifikasi/ReminderPopup.vue';
import AccountWaitingModal from '~/components/notifikasi/AccountWaitingModal.vue';

definePageMeta({
  layout: "default",
});

const auth = useAuth();
const router = useRouter();
const route = useRoute();

const membershipStatus = ref('loading');
const userFullName = ref(auth.value.user?.full_name || 'Pengguna');
const membershipDetails = ref(null);
const invoices = ref([]);
const membershipAccounts = ref([]);
const isLoadingProducts = ref(true);
const isLoadingInvoices = ref(true);
const pendingPackageDetails = ref(null);
const showPendingModal = ref(false);
const showReminderPopup = ref(false);
const showAccountWaitingModal = ref(false);

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

      if (response.data?.end_at) {
        const expiryDate = new Date(response.data.end_at);
        const today = new Date();
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 5 && diffDays > 0) { 
          showReminderPopup.value = true;
        }
      }
      
      // --- PERBAIKAN LOGIKA DI SINI ---
      const totalProductsInPackage = Object.keys(accountsData).length;
      const preparedAccounts = membershipAccounts.value.length;
      // Hapus kondisi `preparedAccounts > 0`
      if (preparedAccounts < totalProductsInPackage) {
        showAccountWaitingModal.value = true;
      }

    } else if (status === 'pending') {
      membershipStatus.value = 'pending';
      const invoiceResponse = await api.getInvoiceList(auth.value.user.id);
      invoices.value = invoiceResponse.data || [];
      
      if (response.data?.product_membership_id) {
        const packageResponse = await api.getMembershipPackage(response.data.product_membership_id);
        pendingPackageDetails.value = packageResponse.data;
      }
      
      const pendingInvoice = invoices.value.find(inv => 
        (inv.status.toLowerCase() === 'pending' || inv.status.toLowerCase() === 'menunggu') && new Date(inv.due_date) > new Date()
      );

      if (pendingInvoice) {
        showPendingModal.value = true;
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

const productListData = computed(() => {
  if (membershipStatus.value === 'pending') {
    if (pendingPackageDetails.value && pendingPackageDetails.value.product_membership_paket) {
      return pendingPackageDetails.value.product_membership_paket.map(item => ({
        title: item.paket_addon?.name,
        image: item.paket_addon?.files?.[0]?.path_string,
        isOwned: false
      }));
    }
  }

  if (membershipStatus.value === 'active') {
    const allPossibleProducts = Object.keys(accountsData);
    const normalizeName = (name) => name.replace(/\s/g, '').toLowerCase();

    return allPossibleProducts.map(staticProductName => {
      const normalizedStaticName = normalizeName(staticProductName);
      
      const ownedAccount = membershipAccounts.value.find(acc => {
        const apiProductName = acc.account_product?.paket_addon?.name;
        if (!apiProductName) return false;
        return normalizedStaticName.includes(normalizeName(apiProductName));
      });
      
      const staticData = accountsData[staticProductName];
      const imageUrl = ownedAccount?.account_product?.paket_addon?.files?.[0]?.path_string;
      
      return {
        title: staticProductName,
        image: imageUrl,
        isOwned: !!ownedAccount,
        apiData: ownedAccount ? {
          owned: true, 
          product: staticProductName,
          email: ownedAccount.account_product?.email,
          password: ownedAccount.account_product?.password,
          profileName: ownedAccount.profile_name,
          pin: ownedAccount.pin,
          link: ownedAccount.link,
          alamat: ownedAccount.alamat,
          tutorial: staticData?.tutorial,
          terms: staticData?.terms,
          consequences: staticData?.consequences,
          displayFields: staticData?.displayFields || ['email', 'password'],
        } : { 
          owned: false, 
          product: staticProductName,
          displayFields: staticData?.displayFields || [],
        }
      };
    });
  }
  return [];
});

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