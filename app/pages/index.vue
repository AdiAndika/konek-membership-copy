<script setup>
import { ref } from 'vue'
definePageMeta({
  layout: "default",
});
// Untuk mengelola status item FAQ yang aktif/terbuka
const openFaq = ref(null);

// Fungsi untuk membuka/menutup item FAQ
const toggleFaq = (index) => {
  if (openFaq.value === index) {
    openFaq.value = null; // Tutup jika item yang sama diklik lagi
  } else {
    openFaq.value = index; // Buka item yang baru
  }
};

// Data untuk FAQ, agar lebih mudah dikelola
const faqs = [
  {
    question: 'Apa itu Konek Plus Membership?',
    answer: 'Konek Plus Membership adalah paket langganan yang memberikan Anda akses ke berbagai aplikasi premium hiburan seperti Netflix, Spotify, dan lainnya dengan sekali bayar setiap bulan.'
  },
  {
    question: 'Apa keuntungan menggunakan Konek Plus Membership?',
    answer: 'Anda akan menghemat lebih banyak uang, proses pembayaran lebih simpel hanya sekali per bulan, dan semua langganan terkelola dalam satu platform yang mudah diakses.'
  },
  {
    question: 'Bagaimana cara berlangganan?',
    answer: 'Cukup klik tombol "Langganan Sekarang", selesaikan pembayaran, dan akun untuk semua aplikasi akan segera diaktifkan dan dikirimkan kepada Anda.'
  },
  {
    question: 'Bagaimana jika saya mengalami masalah akses?',
    answer: 'Tim customer service kami siap membantu Anda 24/7 melalui live chat atau email untuk menyelesaikan segala kendala yang mungkin Anda hadapi.'
  },
  {
    question: 'Apakah saya bisa membatalkan membership kapan saja?',
    answer: 'Tentu saja. Anda bisa membatalkan langganan kapan saja tanpa biaya tambahan. Akses Anda akan tetap aktif hingga akhir periode penagihan berjalan.'
  }
];
</script>

<template>
    <main>
      <section class=" container mx-auto px-6 py-16 text-center">
        <div class="inline-flex items-center bg-blue-100 text-blue-600 text-sm font-semibold px-4 py-1 rounded-full mb-4">
          <img src="~/assets/images/solar-chat.svg" alt="Tag Icon" class="w-4 h-4 mr-2">
          Bundling premium terjangkau
        </div>
        <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          Paket Bundling Aplikasi<br>Premium Satu Klik untuk<br>Semua Hiburanmu
        </h1>
        <p class="mt-4 text-gray-600 max-w-2xl mx-auto">
          Bayar sekali, langsung dapat akses Netflix, Spotify, WeTV, Viu, hingga ChatGPT Plus siap dipakai kapan saja.
        </p>
        <div class="mt-8 md:mt-12 max-w-4xl mx-auto px-4">
          <div class="relative">
            <img src="~/assets/images/hero-image.png" alt="Bundling Aplikasi Premium" class="w-full h-auto rounded-xl">
          </div>
        </div>
      </section>

      <section class="pt-[10px] pb-[60px] bg-gradient-to-b from-white via-blue-50 to-blue-500">
        <div class="container mx-auto px-6 text-center">
          
          <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900">Langganan Sekarang!</h2>
          <p class="text-3xl md:text-4xl font-bold text-gray-700 mt-1">Cuma Rp.99.000 per bulan</p>
          
          <div class="mt-10 max-w-sm mx-auto">
            <a href="#" aria-label="Langganan Sekarang">
              <img 
                src="~/assets/images/card-promo.svg" 
                alt="Kartu Promo Konek Entertainment"
                class="w-full h-auto"
              >
            </a>

            <div class="mt-8">
              <NuxtLink to="/auth/login" class="w-full bg-white text-blue-500 font-bold py-4 px-6 rounded-full flex items-center justify-center space-x-3 shadow-lg hover:bg-gray-100 transition-colors transform hover:scale-105">
                <img src="~/assets/images/keranjang.svg" alt="Ikon Keranjang" class="w-8 h-8">
                <span class="text-lg">Langganan Sekarang</span>
              </NuxtLink>
            </div>
          </div>

        </div>
      </section>

      <section class="py-20 bg-transparent">
        <div class="max-w-3xl mx-auto px-4 space-y-3">
          
          <div 
            v-for="(faq, index) in faqs" 
            :key="index" 
            class="bg-blue-50 rounded-xl shadow-sm transition-all duration-300 border border-blue-300"
          >
            <button 
              @click="toggleFaq(index)" 
              class="w-full flex justify-between items-center text-left p-6 focus:outline-none"
            >
              <span class="text-base font-semibold text-black">
                {{ faq.question }}
              </span>
              <svg
                class="w-6 h-6 transform transition-transform duration-300 flex-shrink-0 text-blue-500"
                :class="{'rotate-180': openFaq === index}"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div 
              v-if="openFaq === index" 
              class="text-base px-6 pb-6 text-black"
            >
              <div class="border-t border-blue-300 pt-4 mt-2">
                <p class="text-base leading-relaxed">
                  {{ faq.answer }}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </main>

    <div class="fixed bottom-6 right-6 z-40">
      <a 
        href="https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20paket%20Konek%20Market." 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Tanya Kami di WhatsApp"
      >
        <img 
          src="~/assets/images/tanya-kami.png" 
          alt="Tanya Kami di WhatsApp" 
          class="w-16 h-16 cursor-pointer hover:scale-110 hover:rotate-12 transition-transform duration-300"
        >
      </a>
    </div>
</template>
