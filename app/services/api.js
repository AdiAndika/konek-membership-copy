// app/services/api.js

const BASE_URL = '/api';
const TOKEN = '292e149c-57b2-4157-8f7a-7a16293967e8'; // Token Anda

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const auth = useAuth();
  const authToken = auth.value.token || TOKEN;

  const headers = {
    'Authorization': `Bearer ${authToken}`,
    'Accept': 'application/json', // Menegaskan kita mau respons JSON
    ...options.headers,
  };

  // Jika body adalah FormData, biarkan browser yang mengatur Content-Type
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      // Jika error, coba baca sebagai JSON dulu
      const errorData = await response.json().catch(() => {
        // Jika gagal, berarti server kirim HTML, tampilkan pesan error yang lebih jelas
        throw new Error(`Server Error: ${response.status} ${response.statusText}. Respons bukan JSON.`);
      });
      throw new Error(errorData.message || 'Terjadi kesalahan pada server');
    }

    if (response.status === 204) {
      return { message: 'Operasi berhasil tanpa konten.' }; // Beri respons default
    }

    return response.json();
  } catch (error) {
    console.error(`Kesalahan pada request API ke ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // --- Autentikasi  ---
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
    
    // --- INI BAGIAN PALING PENTING ---
    // Memberi tahu backend bahwa request POST ini adalah untuk operasi UPDATE (PUT)
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

  getInvoiceList(userId, perPage = 5, order = 'lowest') {
    return request(`/konek/membership/list-invoice?user_id=${userId}&per_page=${perPage}&order=${order}`);
  },

  getMembershipDetail(userId) {
    return request(`/konek/membership/detail-pelanggan-membership?user_id=${userId}&with=users,pelanggan_membership_akun.account_product.paket_addon.files,pelanggan_membership_akun.account_profile`);
  },
  
  getMembershipDetail(userId) {
    // --- PERBAIKAN DI SINI ---
    // Kita akan meminta relasi data yang paling penting saja untuk menghindari error
    const simpleWith = 'users,pelanggan_membership_akun.account_product,pelanggan_membership_akun.account_profile';
    return request(`/konek/membership/detail-pelanggan-membership?user_id=${userId}&with=${simpleWith}`);
  },

  getInvoiceList(userId, perPage = 5, order = 'lowest') {
    return request(`/konek/membership/list-invoice?user_id=${userId}&per_page=${perPage}&order=${order}`);
  },
};