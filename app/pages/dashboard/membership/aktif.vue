<script setup>
const idata = [
  {
    title: "Netflix",
    image: "/src/assets/images/netflix.png",
  },
  {
    title: "Spotify",
    image: "/src/assets/images/spotify.png",
  },
  {
    title: "VIU",
    image: "/src/assets/images/viu_full.png",
  },
  {
    title: "Chat GPT",
    image: "/src/assets/images/chatgpt.png",
  },
  {
    title: "WeTV",
    image: "/src/assets/images/wetv.png",
  },
];
</script>

<template>
  <!-- navbar -->
  <header>
    <div class="container px-4 lg:px-12 py-3">
      <div class="flex justify-between items-center">
        <a href="/">
          <img class="h-10" src="~/assets/images/logo-konek-biru.png" alt="" />
        </a>
        <div>
          <button class="p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>

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
      <!-- <img
        class="w-[400px] md:w-[500px] lg:w-[600px] h-auto"
        src="/src/assets/images/icon-langganan.png"
        alt="icon langganan"
      /> -->
    </div>
  </section>

  <!-- product -->
  <section class="pt-[10px]">
    <div class="container mx-auto px-5 lg:px-6">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900">
        Produk Digital
      </h2>
      <div>
        <div
          v-for="(item, index) in idata"
          :key="index"
          class="flex justify-between items-center"
        >
          <img
            :src="item.image"
            :alt="item.title"
            class="w-24 h-24 object-contain"
          />
          <a href="#">
            <button class="text-[#0080FF] font-semibold">Lihat akun</button>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- history -->
  <section>
    <div class="container mx-auto px-6 lg:py-8">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-xl md:text-4xl font-semibold text-gray-900">
          Histori Pembelian
        </h1>
        <p class="text-[#0080FF] font-semibold">Histori Tagihan</p>
      </div>
      <div class="w-full lg:max-w-[500px] mx-auto lg:p-4 mb-3 lg:mb-0">
        <div
          class="bg-gradient-to-r from-[#E3F0FF] to-[#DFF5FF] rounded-xl shadow-md p-4"
        >
          <div class="flex justify-between items-start mb-3">
            <div class="flex items-start gap-4">
              <img
                src="~/assets/images/logo-konek-biru.png"
                alt="Konek Market"
                class="w-16 h-auto"
              />
              <div>
                <p class="text-sm lg:text-lg font-medium mb-2">
                  Konek Entertainment
                </p>
                <div class="text-sm text-gray-800 space-y-1">
                  <p>
                    ID Pesanan:
                    <span class="font-medium">KNX-20250828-ABC123</span>
                  </p>
                  <p>
                    Tanggal: <span class="font-medium">27 September 2025</span>
                  </p>
                  <p>
                    Metode Bayar:
                    <span class="font-medium">QRIS (via GoPay)</span>
                  </p>
                </div>
              </div>
            </div>
            <button
              class="bg-gradient-to-r from-[#0080FF] to-[#4DC9E6] text-white text-sm px-3 py-1 rounded-md font-medium"
            >
              Lihat Detail
            </button>
          </div>

          <!-- Footer -->
          <div class="flex justify-between items-center mt-4">
            <p class="text-xl font-bold">Rp.99.000</p>
            <p class="text-green-600 font-bold">STATUS BERHASIL</p>
          </div>
        </div>
      </div>
      <div class="lg:max-w-[500px] mx-auto lg:p-4 mb-6 lg:mb-0">
        <div
          class="bg-gradient-to-r from-[#E3F0FF] to-[#DFF5FF] rounded-xl shadow-md p-4"
        >
          <!-- Header -->
          <div class="flex justify-between items-start mb-3">
            <div class="flex items-start gap-4">
              <img
                src="~/assets/images/logo-konek-biru.png"
                alt="Konek Market"
                class="w-16 h-auto"
              />
              <div>
                <p class="font-medium mb-2">Konek Entertainment</p>
                <div class="text-sm text-gray-800 space-y-1">
                  <p>
                    ID Pesanan:
                    <span class="font-medium">KNX-20250828-ABC123</span>
                  </p>
                  <p>
                    Tanggal: <span class="font-medium">27 September 2025</span>
                  </p>
                  <p>
                    Metode Bayar:
                    <span class="font-medium">QRIS (via GoPay)</span>
                  </p>
                </div>
              </div>
            </div>
            <button
              class="bg-gradient-to-r from-[#0080FF] to-[#4DC9E6] text-white text-sm px-3 py-1 rounded-md font-medium"
            >
              Lihat Detail
            </button>
          </div>

          <!-- Footer -->
          <div class="flex justify-between items-center mt-4">
            <p class="text-xl font-bold">Rp.99.000</p>
            <p class="text-green-600 font-bold">STATUS BERHASIL</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- contact -->
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
            <img
              src="~/assets/images/wa.png"
              alt="WhatsApp"
              class="w-6 h-6"
            />
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

  <!-- footer -->
  <footer class="bg-white border-t">
    <div class="container mx-auto px-6 py-8">
      <div
        class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
      >
        <div class="flex space-x-6">
          <a href="#" class="text-gray-500 hover:text-blue-600">
            <svg
              class="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M11.91 10.836c-2.43.1-4.363 2.05-4.363 4.506 0 2.454 1.933 4.404 4.363 4.506 2.43-.1 4.363-2.052 4.363-4.506 0-2.454-1.933-4.404-4.363-4.506zm0 7.428c-1.593-.067-2.866-1.353-2.866-2.954 0-1.6 1.273-2.886 2.866-2.953 1.593.067 2.866 1.353 2.866 2.953 0 1.6-1.273 2.887-2.866 2.954z M17.96 5.282c-1.012.04-1.832.86-1.832 1.872s.82 1.832 1.832 1.872c1.01.04 1.832-.86 1.832-1.872s-.822-1.832-1.832-1.872z M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21.818c-5.417 0-9.818-4.4-9.818-9.818S6.583 2.182 12 2.182s9.818 4.4 9.818 9.818-4.4 9.818-9.818 9.818z M19.742 16.5c.34-.14.576-.43.576-.786V8.286c0-.358-.236-.647-.576-.787-.41-.17-1.15-.1-1.638.16-.487.26-.74.74-.74 1.21v5.717c0 .47.253.95.74 1.21.488.26 1.228.33 1.638.16z"
              ></path>
            </svg>
          </a>
          <a href="#" class="text-gray-500 hover:text-blue-600">
            <svg
              class="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.99 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.99 22 12z"
              ></path>
            </svg>
          </a>
          <a href="#" class="text-gray-500 hover:text-blue-600">
            <svg
              class="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M21.2 2.2c-1.3-1-3.1-1.5-5-1.5s-3.7.5-5 1.5c-2.3 1.8-3.5 4.7-3.5 7.8 0 3.1 1.2 6 3.5 7.8 1.3 1 3.1 1.5 5 1.5s3.7-.5 5-1.5c2.3-1.8 3.5-4.7 3.5-7.8 0-3.1-1.2-6-3.5-7.8zM12 18.5c-3.6 0-6.5-2.9-6.5-6.5S8.4 5.5 12 5.5s6.5 2.9 6.5 6.5-2.9 6.5-6.5 6.5z"
              ></path>
              <path
                d="M12 8.2c-2.1 0-3.8 1.7-3.8 3.8s1.7 3.8 3.8 3.8 3.8-1.7 3.8-3.8-1.7-3.8-3.8-3.8zm0 6c-1.2 0-2.2-1-2.2-2.2s1-2.2 2.2-2.2 2.2 1 2.2 2.2-1 2.2-2.2 2.2zM18.8 6.5c-1 0-1.8-.8-1.8-1.8s.8-1.8 1.8-1.8 1.8.8 1.8 1.8-.8 1.8-1.8 1.8z"
              ></path>
            </svg>
          </a>
          <a href="#" class="text-gray-500 hover:text-blue-600">
            <svg
              class="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM8.5 18H6.5v-7h2v7zM7.5 9.8c-.8 0-1.4-.6-1.4-1.4s.6-1.4 1.4-1.4c.8 0 1.4.6 1.4 1.4s-.6 1.4-1.4 1.4zM18 18h-2v-3.5c0-.8-.2-1.4-.9-1.4s-1.1.6-1.1 1.4V18h-2v-7h2v1c.3-.6 1-1.2 2-1.2 1.5 0 2.9 1 2.9 3.1V18z"
              ></path>
            </svg>
          </a>
        </div>
        <p class="text-sm text-gray-500">Copyright © 2024 - Konek Market</p>
        <div class="text-sm text-gray-600 flex space-x-4">
          <a href="#" class="hover:underline">Syarataf & Ketentuan</a>
          <a href="#" class="hover:underline">Kebijakan Privasi</a>
        </div>
      </div>
    </div>
  </footer>
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
