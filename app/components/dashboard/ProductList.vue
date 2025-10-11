<script setup>
const props = defineProps({
  status: {
    type: String,
    required: true, // 'active' atau 'pending'
  },
  products: {
    type: Array,
    default: () => [],
  },
  isLoading: Boolean,
});

const emit = defineEmits(["open-modal"]);
</script>

<template>
  <section class="mb-12">
    <h2
      class="text-3xl md:text-4xl font-bold text-gray-900 lg:text-gray-50 mb-4"
    >
      Produk Digital
    </h2>
    <div v-if="isLoading" class="text-center text-white p-4">
      Memuat data produk...
    </div>
    <div
      v-else
      class="divide-y divide-gray-200 bg-white p-4 rounded-xl shadow-sm"
    >
      <div
        v-for="(item, index) in products"
        :key="index"
        class="flex justify-between items-center py-3"
      >
        <img
          :src="item.image"
          :alt="item.title"
          class="w-24 h-24 object-contain"
        />

        <button
          v-if="status === 'active'"
          @click="emit('open-modal', item)"
          class="text-[#0080FF] font-semibold hover:underline"
        >
          Lihat akun
        </button>
        <p
          v-else-if="status === 'pending'"
          class="text-yellow-500 font-semibold"
        >
          Menunggu...
        </p>
      </div>
    </div>
  </section>
</template>
