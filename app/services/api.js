// app/services/api.js

async function request(endpoint, options = {}) {
  // Ambil konfigurasi runtime dan state autentikasi
  const config = useRuntimeConfig();
  const auth = useAuth();

  // Tentukan Base URL dan Token Fallback dari runtime config
  const BASE_URL = config.public.OA_API;
  const FALLBACK_TOKEN = config.public.OA_TOKEN;
  
  const url = `${BASE_URL}${endpoint}`;

  // --- LOGIKA UTAMA ---
  // Prioritaskan token dari sesi login pengguna. Jika tidak ada (pengguna belum login),
  // gunakan token fallback dari file .env.
  const authToken = auth.value.token || FALLBACK_TOKEN;

  const headers = {
    'Authorization': `Bearer ${authToken}`,
    'Accept': 'application/json',
    ...options.headers,
  };

  // Jika body adalah FormData, browser akan mengatur Content-Type secara otomatis
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const response = await fetch(url, { ...options, headers });

    // Penanganan error yang lebih detail
    if (!response.ok) {
      const errorData = await response.json().catch(() => {
        // Jika respons error bukan JSON, buat error manual
        throw new Error(`Server Error: ${response.status} ${response.statusText}.`);
      });
      // Lemparkan pesan error dari API
      throw new Error(errorData.message || 'Terjadi kesalahan pada server');
    }

    // Handle respons tanpa konten (misalnya pada request DELETE)
    if (response.status === 204) {
      return { message: 'Operasi berhasil.' };
    }

    return response.json();
  } catch (error) {
    console.error(`Kesalahan pada request API ke ${endpoint}:`, error);
    throw error;
  }
}

// Semua endpoint API ini tidak perlu diubah, karena sudah menggunakan fungsi `request` yang baru.
export const api = {
  // --- Autentikasi ---
  checkUserNumber(phone) {
    const formData = new FormData();
    formData.append('phone', phone);
    return request('/user/check-user-number', {
      method: 'POST',
      body: formData,
    });
  },

  verifyOtp(phone, otp) {
    const formData = new FormData();
    formData.append('phone', phone);
    formData.append('otp', otp);
    return request('/user/verify-otp', {
      method: 'POST',
      body: formData,
    });
  },

  // --- Profil Pengguna ---
  getUserDetail(userId) {
    return request(`/user/users/${userId}/detail-user`);
  },

  updateUser(userId, userData) {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('full_name', userData.full_name);
    formData.append('email', userData.email);
    if (userData.photo) {
      formData.append('photo', userData.photo, userData.photo.name);
    }
    return request(`/user/users/${userId}/update-user`, {
      method: 'POST',
      body: formData,
    });
  },

  // --- Konek Membership ---
  getMembershipPackage(id) {
    return request(`/konek/membership/detail-paket-membership?id=${id}&with=product_membership_paket.paket_addon`);
  },

  orderPackage(payload) {
    return request('/konek/membership/order-paket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },

  getMembershipDetail(userId) {
    const relations = 'users,pelanggan_membership_akun.account_product.paket_addon.files,pelanggan_membership_akun.account_profile';
    return request(`/konek/membership/detail-pelanggan-membership?user_id=${userId}&with=${relations}`);
  },
  
  getInvoiceList(userId, perPage = 5, order = 'lowest') {
    return request(`/konek/membership/list-invoice?user_id=${userId}&per_page=${perPage}&order=${order}`);
  },

  getInvoiceDetail(invoiceId) {
    return request(`/konek/membership/detail-invoice?invoice_id=${invoiceId}&with=order_paket_membership.paket_membership`);
  }
};