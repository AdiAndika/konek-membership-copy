<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import InvoiceDetail from '~/components/Invoice.vue';
import { api } from '~/services/api';

definePageMeta({
  layout: "blanknav",
});

const route = useRoute();
const router = useRouter();

const invoiceData = ref(null);
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const response = await api.getInvoiceDetail(route.params.id);
    
    if (response.data) {
      // Menyesuaikan struktur data untuk komponen InvoiceDetail
      invoiceData.value = {
        id: response.data.invoice_id,
        status: response.data.status_pembayaran,
        paymentDate: response.data.updated_at,
        product: {
          name: response.data.order_paket_membership.paket_membership.nama_paket,
          description: response.data.order_paket_membership.paket_membership.deskripsi_paket,
        },
        payment: {
          method: response.data.payment_method,
          subtotal: response.data.total_pembayaran, // Asumsi total = subtotal
          adminFee: 0,
          total: response.data.total_pembayaran,
        },
      };
    } else {
      error.value = 'Invoice tidak ditemukan.';
    }
  } catch (e) {
    console.error(e);
    error.value = 'Gagal memuat data invoice.';
  } finally {
    isLoading.value = false;
  }
});

const handleBack = () => {
  router.back();
};

const handleDownload = () => {
  alert(`Fungsi unduh untuk invoice ${invoiceData.value.id} akan diimplementasikan di sini.`);
};

const handleCopy = (copiedId) => {
  console.log(`ID ${copiedId} telah disalin.`);
};
</script>

<template>
  <div>
    <div v-if="isLoading" class="flex justify-center items-center h-screen">
      <p class="text-lg text-gray-500">Memuat detail invoice...</p>
    </div>

    <div v-else-if="error" class="flex justify-center items-center h-screen">
      <p class="text-lg text-red-500">{{ error }}</p>
    </div>
    
    <InvoiceDetail 
      v-else-if="invoiceData"
      :invoice="invoiceData"
      @back="handleBack"
      @download="handleDownload"
      @copy="handleCopy"
    />
  </div>
</template>