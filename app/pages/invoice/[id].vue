<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import InvoiceDetail from '~/components/Invoice.vue';

// Menggunakan layout tanpa Navbar dan Footer
definePageMeta({
  layout: "blanknav",
});

const route = useRoute();
const router = useRouter();

const invoiceData = ref(null);
const isLoading = ref(true);
const error = ref(null);

// --- [API LOGIC] ---
// NOTE: Bagian ini adalah simulasi pengambilan data.
// Nanti, Anda bisa mengganti seluruh fungsi ini dengan panggilan API yang sesungguhnya.
const fetchInvoiceData = async (invoiceId) => {
  console.log(`Mengambil data untuk invoice ID: ${invoiceId}`);
  
  // Data tiruan untuk pengembangan UI.
  // Saat API sudah siap, data ini akan datang dari server.
  const mockApiResponse = {
    id: 'KNX-20250828-ABC123',
    status: 'Berhasil',
    paymentDate: '2025-09-02T10:00:00Z',
    product: {
      name: 'Paket Konek Entertainment',
      description: 'Paket Konek Entertainment (1 Bulan)',
    },
    payment: {
      method: 'QRIS - Via Gopay',
      subtotal: 99000,
      adminFee: 0,
      total: 99000,
    },
  };

  // Simulasi delay jaringan agar terlihat seperti memanggil API sungguhan.
  return new Promise(resolve => {
    setTimeout(() => {
      if (invoiceId === mockApiResponse.id) {
        resolve(mockApiResponse);
      } else {
        resolve(null); // Jika ID tidak cocok, anggap invoice tidak ditemukan.
      }
    }, 1000); // delay 1 detik
  });
};
// --- [END OF API LOGIC] ---


// --- LIFECYCLE HOOK ---
// Kode ini akan berjalan saat halaman pertama kali dimuat.
onMounted(async () => {
  try {
    // Panggil fungsi pengambilan data API di sini.
    const data = await fetchInvoiceData(route.params.id);
    
    if (data) {
      invoiceData.value = data; // Simpan data dari API ke state.
    } else {
      error.value = 'Invoice tidak ditemukan.';
    }
  } catch (e) {
    console.error(e);
    error.value = 'Gagal memuat data invoice.';
  } finally {
    isLoading.value = false; // Sembunyikan loading indicator.
  }
});


// --- EVENT HANDLERS ---
// Fungsi ini dipanggil saat komponen anak (InvoiceDetail) mengirim event 'back'
const handleBack = () => {
  console.log('Event "back" diterima, navigasi kembali.');
  router.back();
};

// Fungsi ini dipanggil saat komponen anak (InvoiceDetail) mengirim event 'download'
const handleDownload = () => {
  // NOTE: Logika untuk mengunduh invoice (misalnya generate PDF) akan ditambahkan di sini.
  console.log('Event "download" diterima.');
  alert(`Fungsi unduh untuk invoice ${invoiceData.value.id} akan diimplementasikan di sini.`);
};

// Fungsi ini dipanggil saat komponen anak (InvoiceDetail) mengirim event 'copy'
const handleCopy = (copiedId) => {
  console.log(`Event "copy" diterima, ID ${copiedId} telah disalin.`);
  // Anda bisa menambahkan notifikasi kecil di sini jika mau
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