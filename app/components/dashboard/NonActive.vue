<script setup>
import ContactCard from './ContactCard.vue';

defineProps({
  userFullName: {
    type: String,
    default: 'Pengguna'
  }
});
</script>

<template>
  <div>
    <section
      style="background: linear-gradient(180deg, #6B7280 0%, #fff 61.07%)"
      class="flex flex-col items-center justify-center p-4 py-8"
    >
      <div
        class="rounded-[24px] bg-white w-full lg:w-[500px] shadow-[0_4px_15px_0_rgba(0,0,0,0.25)] p-4"
      >
        <div class="text-center">
          <div class="flex justify-center items-center gap-3">
            <h1 class="text-[#374151] font-[Outfit] text-[20px] lg:text-[24px] font-medium">
              Selamat datang 👋
            </h1>
          </div>
          <h1 class="text-[#374151] font-[Outfit] text-[26px] lg:text-[32px] font-semibold">
            {{ userFullName }}
          </h1>
          <div class="my-4">
            <img
              class="mx-auto w-70 h-70 lg:w-40 lg:h-40"
              src="~/assets/images/member-nonaktif.svg"
              alt="member non aktif"
            />
          </div>
          <h2 class="text-[#374151] font-[Outfit] text-[22px] lg:text-[24px] font-semibold mb-2">
            Paket Membership Kosong
          </h2>
          <p class="lg:w-[400px] mx-auto text-center text-[#374151] font-[Outfit] lg:text-[20px] mb-6">
            Ayo langganan sekarang, nikmati berbagai hiburan dan edukasi menarik
          </p>
          
          <a
            href="#paket-penawaran"
            class="flex items-center justify-center gap-2 w-full py-3 rounded-[12px] bg-[#1D9BF0] text-white font-[Outfit] text-[16px] font-semibold"
          >
            <img src="~/assets/images/cart.png" alt="cart" class="w-5 h-5" />
            Langganan Sekarang
          </a>
        </div>
      </div>
      <div class="my-4 flex justify-center">
        <img
          class="w-[400px] md:w-[500px] lg:w-[600px] h-auto"
          src="~/assets/images/icon-langganan.svg"
          alt="icon langganan"
        />
      </div>
    </section>

    <section
      id="paket-penawaran"
      class="pt-[10px] pb-[60px] bg-gradient-to-b from-white via-blue-50 to-blue-500"
    >
      <div class="container mx-auto px-3 lg:px-6 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900">
          Langganan Sekarang! Cuma Rp.99.000 per bulan
        </h2>
        <div class="mt-10 max-w-sm mx-auto">
          <NuxtLink to="/payment/checkout" aria-label="Langganan Sekarang">
            <img
              src="~/assets/images/card-promo.svg"
              alt="Kartu Promo Konek Entertainment"
              class="w-full h-auto"
            />
          </NuxtLink>

          <div class="mt-8">
            <NuxtLink
              to="/payment/checkout"
              class="w-full bg-white text-[#0694FF] font-bold py-3 px-6 rounded-full flex items-center justify-center space-x-3 shadow-lg hover:scale-105"
            >
              <img
                src="~/assets/images/keranjang.svg"
                alt="Ikon Keranjang"
                class="w-8 h-8"
              />
              <span class="text-[22px]">Langganan Sekarang</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
    
    <section class="py-16 bg-transparent">
      <div class="container mx-auto px-4 max-w-lg">
        <ContactCard />
      </div>
    </section>

  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap");

/* PERUBAHAN DI SINI: Menambahkan efek scroll yang halus */
html {
  scroll-behavior: smooth;
}
</style>