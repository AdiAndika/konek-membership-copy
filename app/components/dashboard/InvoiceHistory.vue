<script setup>
import { ref } from 'vue';
import ExpiredInvoiceModal from '~/components/notifikasi/ExpiredInvoiceModal.vue';
import { useState } from '#app';

const props = defineProps({
  invoices: {
    type: Array,
    default: () => [],
  },
  isLoading: Boolean,
});

const router = useRouter();
const checkoutState = useState('checkoutState', () => null);
const showExpiredModal = ref(false);

const handleDetailClick = (invoice) => {
  // Navigasi ke halaman invoice dengan query ID untuk menampilkan detail
  router.push(`/payment/invoices?id=${invoice.invoice_id}`);
};

const handleSubscribeNow = () => {
  showExpiredModal.value = false;
  checkoutState.value = null;
  router.push('/payment/checkout');
};

const getStatusInfo = (invoice) => {
  const status = invoice.status ? invoice.status.toLowerCase() : '';
  const isExpired = new Date(invoice.due_date) < new Date();

  if (status === 'paid' || status === 'berhasil') {
    return { text: 'Berhasil', class: 'text-green-600' };
  }
  if ((status === 'pending' || status === 'menunggu') && isExpired) {
    return { text: 'Kadaluwarsa', class: 'text-red-500' };
  }
  if (status === 'pending' || status === 'menunggu') {
    return { text: 'Pending', class: 'text-yellow-500' };
  }
  return { text: invoice.status || 'Gagal', class: 'text-red-500' };
};

const formatCurrency = (value) => {
  if (typeof value !== 'number') return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};
</script>

<template>
  <section>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl md:text-3xl font-semibold text-gray-900">
        Histori Pembelian
      </h1>
      <NuxtLink to="/payment/invoices" class="text-blue-600 font-semibold hover:underline">
        Lihat Semua
      </NuxtLink>
    </div>

    <div v-if="isLoading" class="text-center p-4">Memuat histori...</div>
    <div v-else-if="!invoices || invoices.length === 0" class="text-center p-4 text-gray-500">
      Belum ada histori pembelian.
    </div>
    <div v-else class="space-y-4">
      <div 
        v-for="invoice in invoices" 
        :key="invoice.invoice_id"
        class="bg-gradient-to-r from-[#E3F0FF] to-[#DFF5FF] rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
        @click="handleDetailClick(invoice)"
      >
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-start gap-4">
            <img src="~/assets/images/logo-konek-biru.png" alt="Konek Market" class="w-16 h-auto" />
            <div>
              <p class="text-base font-medium mb-2">{{ invoice.order_paket_membership?.paket_membership?.nama_paket || 'Paket Membership' }}</p>
              <div class="text-xs text-gray-800 space-y-1">
                <p>ID: <span class="font-medium">{{ invoice.invoice_no }}</span></p>
                <p>Tanggal: <span class="font-medium">{{ new Date(invoice.created_at).toLocaleDateString('id-ID') }}</span></p>
              </div>
            </div>
          </div>
          <button class="bg-gradient-to-r from-[#0080FF] to-[#4DC9E6] text-white text-xs px-3 py-1 rounded-md font-medium">
            Detail
          </button>
        </div>
        <div class="flex justify-between items-center mt-4">
          <p class="text-lg font-bold">{{ formatCurrency(invoice.amount) }}</p>
          <p class="font-bold text-sm uppercase" :class="getStatusInfo(invoice).class">
            {{ getStatusInfo(invoice).text }}
          </p>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200 ease-out"
        leave-active-class="transition-opacity duration-200 ease-in"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <ExpiredInvoiceModal
          v-if="showExpiredModal"
          @close="showExpiredModal = false"
          @subscribe="handleSubscribeNow"
        />
      </Transition>
    </Teleport>

  </section>
</template>