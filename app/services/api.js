// app/services/api.js (SUDAH DIPERBAIKI ✔️)

// Fungsi `request` sekarang bertanggung jawab untuk mendapatkan konfigurasi
async function request(endpoint, options = {}) {
  // Panggil `useRuntimeConfig` di dalam fungsi, di mana ini aman dilakukan
  const config = useRuntimeConfig();
  const BASE_URL = config.public.OA_API;
  const TOKEN = config.public.OA_TOKEN;

  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || "Terjadi kesalahan pada server");
  }

  return response.json();
}

// Bagian ini tidak perlu diubah sama sekali
export const api = {
  checkUserNumber(phone) {
    const formData = new FormData();
    formData.append("phone", phone);
    return request("/user/check-user-number", {
      method: "POST",
      body: formData,
    });
  },

  verifyOtp(phone, otp) {
    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("otp", otp);
    return request("/user/verify-otp", {
      method: "POST",
      body: formData,
    });
  },

  // --- Profil Pengguna ---
  getUserDetail(userId) {
    return request(`/user/users/${userId}/detail-user`);
  },

  updateUser(userId, userData) {
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("full_name", userData.full_name);
    formData.append("email", userData.email);
    if (userData.photo) {
      formData.append("photo", userData.photo, userData.photo.name);
    }
    return request(`/user/users/${userId}/update-user`, {
      method: "POST",
      body: formData,
    });
  },

  // --- Pelanggan Membership ---
  getMembershipPackage(id) {
    // Ditambahkan .files untuk menyertakan data file dari addon
    const relations = "product_membership_paket.paket_addon.files";
    return request(
      `/konek/membership/detail-paket-membership?id=${id}&with=${relations}`
    );
  },

  orderPackage(payload) {
    const formData = new FormData();
    // Loop melalui payload dan tambahkan ke FormData
    for (const key in payload) {
      if (payload[key] !== null && payload[key] !== undefined) {
        formData.append(key, payload[key]);
      }
    }

    return request("/konek/membership/order-paket", {
      method: "POST",
      body: formData,
    });
  },

  getMembershipDetail(userId) {
    const relations =
      "users,pelanggan_membership_akun.account_product.paket_addon.files,pelanggan_membership_akun.account_profile";
    return request(
      `/konek/membership/detail-pelanggan-membership?user_id=${userId}&with=${relations}`
    );
  },

  getInvoiceList(userId, perPage = 5, order = "lowest") {
    return request(
      `/konek/membership/list-invoice?user_id=${userId}&per_page=${perPage}&order=${order}`
    );
  },
};
