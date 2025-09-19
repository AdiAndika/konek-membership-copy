// app/services/api.js

// Pastikan BASE_URL adalah '/api' agar proxy bekerja
const BASE_URL = '/api'; 
const TOKEN = '292e149c-57b2-4157-8f7a-7a16293967e8'; // Token baru Anda

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Terjadi kesalahan pada server');
  }

  return response.json();
}

export const api = {
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
};