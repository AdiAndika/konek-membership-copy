<template>
  <!-- content dashboard -->
  <section
    style="background: linear-gradient(180deg, #0080ff 0%, #fff 61.07%)"
    class="flex flex-col items-center justify-center p-4 py-8"
  >
    <div
      class="rounded-[24px] bg-white w-full lg:w-[500px] shadow-[0_4px_15px_0_rgba(0,0,0,0.25)] p-4"
    >
      <div class="text-center">
        <div class="flex justify-center items-center gap-3">
          <h1
            class="text-[#374151] font-[Outfit] text-[20px] lg:text-[24px] font-medium"
          >
            Selamat datang
          </h1>
          <img src="~/assets/images/love.png" alt="" />
        </div>
        <h1
          class="text-[#374151] font-[Outfit] text-[26px] lg:text-[32px] font-semibold"
        >
          Kadek Gandi Taruna Wijaya
        </h1>
        <div class="my-4">
          <img
            class="mx-auto w-32 h-32 lg:w-52 lg:h-52"
            src="~/assets/images/icon-member.png"
            alt=""
          />
        </div>
        <h2
          class="text-[#374151] font-[Outfit] text-[22px] lg:text-[24px] font-semibold mb-2"
        >
          Paket Membership Kosong
        </h2>
        <p
          class="lg:w-[400px] mx-auto text-center text-[#374151] font-[Outfit] lg:text-[20px] mb-6"
        >
          Ayo langganan sekarang, nikmati berbagai hiburan dan edukasi menarik
        </p>
        <button
          class="flex items-center justify-center gap-2 w-full py-3 rounded-[12px] bg-[#1D9BF0] text-white font-[Outfit] text-[16px] font-semibold"
        >
          <img src="~/assets/images/cart.png" alt="cart" class="w-5 h-5" />
          Langganan Sekarang
        </button>
      </div>
    </div>
    <div class="my-4 flex justify-center">
      <img
        class="w-[400px] md:w-[500px] lg:w-[600px] h-auto"
        src="~/assets/images/icon-langganan.png"
        alt="icon langganan"
      />
    </div>
  </section>

  <!-- product -->
  <section
    class="pt-[10px] pb-[60px] bg-gradient-to-b from-white via-blue-50 to-blue-500"
  >
    <div class="container mx-auto px-3 lg:px-6 text-center">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900">
        Langganan Sekarang! Cuma Rp.99.000 per bulan
      </h2>
      <div class="mt-10 max-w-sm mx-auto">
        <a href="#" aria-label="Langganan Sekarang">
          <img
            src="~/assets/images/card-promo.svg"
            alt="Kartu Promo Konek Entertainment"
            class="w-full h-auto"
          />
        </a>

        <div class="mt-8">
          <button
            class="w-full bg-white text-[#0694FF] font-bold py-3 px-6 rounded-full flex items-center justify-center space-x-3 shadow-lg hover:scale-105"
          >
            <img
              src="~/assets/images/keranjang.svg"
              alt="Ikon Keranjang"
              class="w-8 h-8"
            />
            <span class="text-[22px]">Langganan Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- contact -->\
  <section>
    <div class="container mx-auto px-6 lg:py-8">
      <div class="max-w-md mx-auto bg-white rounded-lg">
        <h1 class="text-xl md:text-3xl font-bold text-gray-900 mb-3">
          Hubungi Kami
        </h1>
        <h2 class="text-md md:text-xl font-medium text-gray-900 mb-2">
          Jam Operasional
        </h2>
        <div class="flex justify-between items-center mb-2">
          <h3 class="">Senin - Jumat :</h3>
          <p class="font-semibold">09.00 - 17.00 WITA</p>
        </div>
        <div class="flex justify-between items-center mb-2">
          <h3>Sabtu :</h3>
          <p class="font-semibold">09.00 - 17.00 WITA</p>
        </div>
        <div class="flex justify-between items-center">
          <h3>Minggu & Tanggal Merah :</h3>
          <p class="text-red-500 font-semibold">Libur</p>
        </div>
      </div>
      <div class="w-full max-w-md mx-auto my-4">
        <div
          class="flex items-center justify-between border rounded-xl px-4 py-3 shadow-sm bg-white"
        >
          <!-- Kiri: Icon + Text -->
          <div class="flex items-center space-x-3">
            <img src="~/assets/images/wa.png" alt="WhatsApp" class="w-6 h-6" />
            <span class="text-[#111827] font-semibold">Admin Konek Plus</span>
          </div>

          <!-- Kanan: Arrow -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-5 h-5 text-gray-500"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap");
#login {
  background: linear-gradient(
    107deg,
    #3ef7f7 2.61%,
    #0080ff 51.9%,
    #30c1ff 101.2%
  );
}
</style>
