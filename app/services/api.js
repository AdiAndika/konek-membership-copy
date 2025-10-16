// app/services/api.js

async function request(endpoint, options = {}) {
  // Ambil konfigurasi runtime dan state autentikasi
  const config = useRuntimeConfig();
  const auth = useAuth();

  // Tentukan Base URL dan Token Fallback dari runtime config
  const BASE_URL = config.public.OA_API;
  const FALLBACK_TOKEN = config.public.OA_TOKEN;

  const url = `${BASE_URL}${endpoint}`;

  // Prioritaskan token dari sesi login pengguna.
  const authToken = auth.value.token || FALLBACK_TOKEN;

  const headers = {
    Authorization: `Bearer ${authToken}`,
    Accept: "application/json",
    ...options.headers,
  };

  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  try {
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const errorData = await response.json().catch(() => {
        throw new Error(
          `Server Error: ${response.status} ${response.statusText}.`
        );
      });
      throw new Error(errorData.message || "Terjadi kesalahan pada server");
    }

    if (response.status === 204) {
      return { message: "Operasi berhasil." };
    }

    return response.json();
  } catch (error) {
    console.error(`Kesalahan pada request API ke ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // --- Autentikasi ---
  checkUserNumber(phone) {
    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("type", "login_membership"); // Penambahan parameter type
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

  // --- Konek Membership ---
  getMembershipPackage(id) {
    return request(
      `/konek/membership/detail-paket-membership?id=${id}&with=product_membership_paket.paket_addon.files`
    );
  },

  orderPackage(payload) {
    const formData = new FormData();
    for (const key in payload) {
      formData.append(key, payload[key]);
    }
    return request("/konek/membership/order-paket", {
      method: "POST",
      body: formData,
    });
  },

  regenerateInvoice(payload) {
    const formData = new FormData();
    for (const key in payload) {
      formData.append(key, payload[key]);
    }
    return request("/konek/membership/regenerate-invoice", {
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

  // --- PERUBAHAN DI SINI: FUNGSI BARU UNTUK DETAIL INVOICE ---
  getInvoiceDetailByNo(invoiceId, invoiceNo) {
    return request(
      `/konek/membership/detail-invoice-pelanggan-membership?invoice_id=${invoiceId}&invoice_no=${invoiceNo}`
    );
  },
  // --- AKHIR PERUBAHAN ---

  getInvoiceDetail(invoiceId) {
    return request(
      `/konek/membership/detail-invoice?invoice_id=${invoiceId}&with=order_paket_membership.paket_membership`
    );
  },
};