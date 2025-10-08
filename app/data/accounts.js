// app/data/accounts.js

// Kunci objek (Netflix, Spotify) digunakan untuk pencocokan
export const accountsData = {
  'Netflix Premium': { // Kunci disamakan dengan nama produk dari API
    displayFields: ['title','email', 'password', 'profileName', 'pin'],
    tutorial: [
        "Buka Netflix akses lewat aplikasi (HP/Laptop/Komputer) atau website netflix.com",
        "Login dan masukkan email & password akun yang sudah langganan.",
        "Pilih profil pengguna yang sudah ditentukan.",
        "Masukkan PIN dari profil tersebut",
        "Mulai nonton dan cari film/serial, lalu klik Play.",
    ],
    terms: [
        "Akun bersifat sharing, namun profile tetap private. Jadi Mohon gunakan secara bijak dan sesuai aturan yang diberikan.",
        "Akun direkomendasikan untuk diakses via HP, tablet, dan laptop/PC.",
        "Sebagai fitur tambahan, akun juga dapat diakses melalui smart TV dan sejenisnya (selama tidak terkena household/kebijakan lain dari netflix)",
        "Jangan ubah profil, password, atau pengaturan akun.",
        "Hanya bisa digunakan di satu perangkat, jika ingin pindah perangkat silahkan log out dari perangkat sebelumnya",
    ],
    consequences: [
        "Blacklist",
        "Pembelian dianggap hangus tanpa pengembalian dana"
    ],
  },
  'Spotify Premium': {
    displayFields: ['title', 'link', 'alamat'],
    tutorial: [
        "Buka aplikasi Spotify di HP, desktop, atau akses web player di spotify.com.",
        "Login menggunakan email dan password akun yang sudah berlangganan Premium.",
        "Pastikan status Premium aktif di menu Akun.",
        "Jika diminta verifikasi pembayaran atau metode langganan, selesaikan prosesnya.",
        "Setelah status Premium aktif, langsung bisa memutar musik tanpa iklan dan mengunduh lagu."
    ],
    terms: [
        "Akun bersifat sharing, namun profile tetap private. Jadi Mohon gunakan secara bijak dan sesuai aturan yang diberikan.",
        "Akun direkomendasikan untuk diakses via HP, tablet, dan laptop/PC.",
        "Sebagai fitur tambahan, akun juga dapat diakses melalui smart TV dan sejenisnya (selama tidak terkena household/kebijakan lain dari netflix)",
        "Jangan ubah profil, password, atau pengaturan akun.",
        "Hanya bisa digunakan di satu perangkat, jika ingin pindah perangkat silahkan log out dari perangkat sebelumnya"
    ],
    consequences: [
        "Blacklist",
        "Pembelian dianggap hangus tanpa pengembalian dana"
    ],
  },
  'VIU Premium': {
    displayFields: ['title','email', 'password'],
    tutorial: [
        "Buka aplikasi atau website VIU.",
        "Login dengan email/nomor HP yang dipakai untuk berlangganan.",
        "Pastikan status akun sudah Premium (cek di menu Akun).",
        "Tutup dan buka ulang aplikasi jika status belum berubah.",
        "Pilih konten berlabel Premium, lalu putar."
    ],
    terms: [
        "Akun bersifat sharing, namun profile tetap private. Jadi Mohon gunakan secara bijak dan sesuai aturan yang diberikan.",
        "Akun direkomendasikan untuk diakses via HP, tablet, dan laptop/PC.",
        "Sebagai fitur tambahan, akun juga dapat diakses melalui smart TV dan sejenisnya (selama tidak terkena household/kebijakan lain dari netflix)",
        "Jangan ubah profil, password, atau pengaturan akun.",
        "Hanya bisa digunakan di satu perangkat, jika ingin pindah perangkat silahkan log out dari perangkat sebelumnya" 
    ],
    consequences: [
        "Blacklist", 
        "Pembelian dianggap hangus tanpa pengembalian dana"
    ],
  },
  'WeTV Premium': {
    displayFields: ['title','email', 'password'],
    tutorial: [
        "Buka aplikasi atau website WeTV.",
        "Login dengan akun yang sudah berlangganan (email, HP, atau akun sosial media).",
        "Cek menu Akun untuk memastikan status Premium aktif.",
        "Jika belum aktif, lakukan sinkronisasi dengan logout-login ulang.",
        "Akses konten VIP, lalu putar untuk mulai menonton."
    ],
    terms: [
        "Akun bersifat sharing, namun profile tetap private. Jadi Mohon gunakan secara bijak dan sesuai aturan yang diberikan.",
        "Akun direkomendasikan untuk diakses via HP, tablet, dan laptop/PC.",
        "Sebagai fitur tambahan, akun juga dapat diakses melalui smart TV dan sejenisnya (selama tidak terkena household/kebijakan lain dari netflix)",
        "Jangan ubah profil, password, atau pengaturan akun.",
        "Hanya bisa digunakan di satu perangkat, jika ingin pindah perangkat silahkan log out dari perangkat sebelumnya",
    ],
    consequences: [
        "Blacklist", 
        "Pembelian dianggap hangus tanpa pengembalian dana"
    ],
  },
};