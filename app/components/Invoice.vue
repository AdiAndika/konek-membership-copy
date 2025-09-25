<script setup>
import { ref, computed } from 'vue';

// --- PROPS ---
// Komponen ini menerima satu prop 'invoice' yang berisi semua data
// yang dibutuhkan untuk ditampilkan.
const props = defineProps({
  invoice: {
    type: Object,
    required: true,
  },
});

// --- EMITS ---
// Komponen ini akan mengirimkan event ke parent component
// saat tombol 'kembali' atau 'unduh' diklik.
const emit = defineEmits(['back', 'download', 'copy']);

// --- STATE ---
const copyStatus = ref('Salin ID');

// --- COMPUTED PROPERTIES ---
// Mengubah status menjadi objek dengan kelas & teks yang sesuai
const statusInfo = computed(() => {
  if (props.invoice.status.toLowerCase() === 'berhasil') {
    return {
      text: 'Berhasil',
      class: 'bg-green-100 text-green-800',
    };
  }
  // Anda bisa menambahkan status lain di sini, contoh:
  // if (props.invoice.status.toLowerCase() === 'pending') {
  //   return {
  //     text: 'Pending',
  //     class: 'bg-yellow-100 text-yellow-800',
  //   };
  // }
  return {
    text: props.invoice.status,
    class: 'bg-gray-100 text-gray-800',
  };
});

// --- METHODS ---
// Fungsi untuk memformat angka menjadi format mata uang Rupiah
const formatCurrency = (value) => {
  if (typeof value !== 'number') return value;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value).replace('Rp', 'Rp ');
};

// Fungsi untuk memformat tanggal
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Fungsi untuk menyalin ID Invoice
const copyInvoiceId = () => {
  navigator.clipboard.writeText(props.invoice.id).then(() => {
    copyStatus.value = 'Tersalin!';
    emit('copy', props.invoice.id);
    setTimeout(() => {
      copyStatus.value = 'Salin ID';
    }, 2000);
  }).catch(err => {
    console.error('Gagal menyalin:', err);
    copyStatus.value = 'Gagal';
  });
};
</script>

<template>
  <div class="bg-gray-50 min-h-screen font-sans">
    <div class="container mx-auto max-w-lg p-4">
      <header class="flex items-center mb-6">
        <button @click="emit('back')" class="text-blue-500 font-semibold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </button>
      </header>

      <main class="text-center">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Detail Pemesanan</h1>
        
        <img src="~/assets/images/invoice.svg" alt="Invoice Icon" class="w-20 h-20 mx-auto mb-4"/>

        <p class="text-4xl font-bold text-gray-900">{{ formatCurrency(invoice.payment.total) }}</p>
        <p class="text-gray-500 mt-1">{{ invoice.id }}</p>

        <div class="border-t border-b border-gray-200 my-6 py-4 px-2 space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Status</span>
            <span
              class="text-sm font-semibold px-3 py-1 rounded-full"
              :class="statusInfo.class"
            >
              {{ statusInfo.text }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Tanggal Pembayaran</span>
            <span class="font-semibold text-gray-800">{{ formatDate(invoice.paymentDate) }}</span>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6 text-left">
          <div class="flex justify-between items-start mb-6">
            <h2 class="text-xl font-bold text-gray-900">{{ invoice.product.name }}</h2>
            <button @click="copyInvoiceId" class="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>

          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">No. Invoice</span>
              <span class="font-medium text-gray-800">{{ invoice.id }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Detail Produk</span>
              <span class="font-medium text-gray-800 text-right">{{ invoice.product.description }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Metode Bayar</span>
              <span class="font-medium text-gray-800">{{ invoice.payment.method }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Sub Total</span>
              <span class="font-medium text-gray-800">{{ formatCurrency(invoice.payment.subtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Biaya Admin</span>
              <span class="font-medium text-gray-800">{{ formatCurrency(invoice.payment.adminFee) }}</span>
            </div>
          </div>

          <hr class="my-4 border-gray-200" />

          <div class="flex justify-between items-center">
            <span class="text-base font-bold text-blue-600">Total</span>
            <span class="text-base font-bold text-blue-600">{{ formatCurrency(invoice.payment.total) }}</span>
          </div>
        </div>

        <div class="mt-8">
          <button @click="emit('download')" class="w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Unduh</span>
          </button>
        </div>
      </main>
    </div>
  </div>
</template>