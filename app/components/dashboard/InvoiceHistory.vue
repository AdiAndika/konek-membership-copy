<script setup>
const props = defineProps({
  invoices: {
    type: Array,
    default: () => [],
  },
  isLoading: Boolean,
});

const getStatusClass = (status) => {
  const lowerCaseStatus = status ? status.toLowerCase() : '';
  if (lowerCaseStatus === 'paid' || lowerCaseStatus === 'berhasil') {
    return 'text-green-600';
  }
  if (lowerCaseStatus === 'pending') {
    return 'text-yellow-500';
  }
  return 'text-red-500';
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
      <p class="text-[#0080FF] font-semibold cursor-pointer">Lihat Semua</p>
    </div>

    <div v-if="isLoading" class="text-center p-4">Memuat histori...</div>
    <div v-else-if="!invoices || invoices.length === 0" class="text-center p-4 text-gray-500">
      Belum ada histori pembelian.
    </div>
    <div v-else class="space-y-4">
      <div 
        v-for="invoice in invoices" 
        :key="invoice.invoice_id"
        class="bg-gradient-to-r from-[#E3F0FF] to-[#DFF5FF] rounded-xl shadow-md p-4"
      >
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-start gap-4">
            <img src="~/assets/images/logo-konek-biru.png" alt="Konek Market" class="w-16 h-auto" />
            <div>
              <p class="text-base font-medium mb-2">{{ invoice.pelanggan_membership?.product_membership?.name || 'Produk' }}</p>
              <div class="text-xs text-gray-800 space-y-1">
                <p>ID: <span class="font-medium">{{ invoice.invoice_no }}</span></p>
                <p>Tanggal: <span class="font-medium">{{ new Date(invoice.created_at).toLocaleDateString('id-ID') }}</span></p>
              </div>
            </div>
          </div>
          <NuxtLink :to="`/invoice/${invoice.invoice_id}`" class="bg-gradient-to-r from-[#0080FF] to-[#4DC9E6] text-white text-xs px-3 py-1 rounded-md font-medium">
            Detail
          </NuxtLink>
        </div>
        <div class="flex justify-between items-center mt-4">
          <p class="text-lg font-bold">{{ formatCurrency(invoice.amount) }}</p>
          <p class="font-bold text-sm uppercase" :class="getStatusClass(invoice.status)">
            {{ invoice.status }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>