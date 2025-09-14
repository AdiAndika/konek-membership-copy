<script setup>
import { ref } from 'vue'
definePageMeta({
  layout: "landing",
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
      
      <!-- card promo belum jadi -->
      <!-- <section class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-blue-600">
        
        <div class="w-full max-w-sm font-sans">
          
          <div class="relative">
            
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-white/20 rounded-b-xl"></div>

            <div class="mt-3 relative bg-white/90 backdrop-blur-lg rounded-[2rem] shadow-2xl overflow-hidden">
              
              <div class="pt-8 pb-12 px-6 text-center">
                <h3 class="text-3xl font-extrabold">
                  <span class="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                    Konek Entertainment
                  </span>
                </h3>
                <div class="flex justify-center items-baseline text-gray-800 mt-2">
                  <span class="text-lg font-semibold">Rp.</span>
                  <span class="text-6xl font-extrabold tracking-tight">99</span>
                  <div class="flex flex-col items-start ml-1">
                    <span class="text-lg font-semibold leading-none">.000</span>
                    <span class="text-sm font-medium text-gray-500 leading-none">/bulan</span>
                  </div>
                </div>
              </div>
              
              <div class="relative">
                <svg class="absolute top-0 w-full h-auto" viewBox="0 0 358 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M358 28C285.2 28 233.2 0 179 0C124.8 0 72.8 28 0 28H358Z" fill="white"/>
                </svg>

                <div class="relative pt-10 pb-8 px-8 bg-gradient-to-b from-blue-400 to-blue-500">
                  <ul class="space-y-4 text-left">
                    <li class="flex items-center">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1024px-Netflix_2015_logo.svg.png" class="w-7 h-7 mr-4" alt="Netflix">
                      <span class="font-semibold text-gray-800 text-lg">Netflix Premium</span>
                    </li>
                    <li class="flex items-center">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/1024px-Spotify_icon.svg.png" class="w-7 h-7 mr-4" alt="Spotify">
                      <span class="font-semibold text-gray-800 text-lg">Spotify Premium</span>
                    </li>
                    <li class="flex items-center">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png" class="w-7 h-7 mr-4" alt="ChatGPT">
                      <span class="font-semibold text-gray-800 text-lg">Chat GPT Plus</span>
                    </li>
                    <li class="flex items-center">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/WeTV_logo.svg/1024px-WeTV_logo.svg.png" class="h-5 mr-4" alt="WeTV">
                      <span class="font-semibold text-gray-800 text-lg">WeTV Premium</span>
                    </li>
                    <li class="flex items-center">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Viu_logo.svg/1024px-Viu_logo.svg.png" class="h-5 mr-4" alt="Viu">
                      <span class="font-semibold text-gray-800 text-lg">VIU Premium</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <button class="w-full bg-white text-blue-600 font-bold py-4 px-6 rounded-full flex items-center justify-center space-x-3 shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-105">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              <span class="text-lg">Langganan Sekarang</span>
            </button>
          </div>

        </div>
      </section> -->

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
              <button class="w-full bg-white text-blue-500 font-bold py-4 px-6 rounded-full flex items-center justify-center space-x-3 shadow-lg hover:bg-gray-100 transition-colors transform hover:scale-105">
                <img src="~/assets/images/keranjang.svg" alt="Ikon Keranjang" class="w-8 h-8">
                <span class="24px text-lg">Langganan Sekarang</span>
              </button>
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
