<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import InvoiceDetail from '~/components/Invoice.vue';
import { api } from '~/services/api';

import DashboardLoadingSpinner from '~/components/LoadingSpinner.vue';

definePageMeta({
  layout: "blanknav",
});

const route = useRoute();
const router = useRouter();

const invoiceData = ref(null);
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  // --- MODIFIKASI DIMULAI: Tambahkan blok ini untuk tes tampilan ---

  // Anda bisa mengganti `true` dengan `false` untuk mencoba kembali logika API asli.
  const useMockData = true;

  if (useMockData) {
    // Isi dengan data tiruan untuk preview
    invoiceData.value = {
      id: 'INV/2025/10/KONEK-12345',
      status: 'Berhasil',
      paymentDate: new Date(),
      product: {
        name: 'Paket Konek Entertainment',
        description: 'Langganan 1 Bulan',
      },
      payment: {
        method: 'QRIS',
        subtotal: 99000,
        adminFee: 0,
        total: 99000,
      },
    };
    isLoading.value = false;
    return; // Hentikan eksekusi agar tidak memanggil API
  }
  
  // --- AKHIR MODIFIKASI ---


  // Kode asli untuk mengambil data dari API
  try {
    const response = await api.getInvoiceDetail(route.params.id);
    
    if (response.data) {
      const data = response.data;
      invoiceData.value = {
        id: data.invoice_no,
        status: data.status,
        paymentDate: data.updated_at,
        product: {
          name: data.order_paket_membership?.paket_membership?.nama_paket || 'Paket Membership',
          description: data.order_paket_membership?.paket_membership?.deskripsi_paket || 'Langganan Bulanan',
        },
        payment: {
          method: data.payment_method || 'N/A',
          subtotal: data.amount,
          adminFee: 0,
          total: data.amount,
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
      <DashboardLoadingSpinner />
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