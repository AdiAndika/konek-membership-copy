// app/composables/useCheckout.js
import { useState } from '#app';

// State ini akan menyimpan data invoice yang belum selesai
// agar bisa ditampilkan kembali di halaman checkout.
export const useCheckoutState = () => useState('checkoutState', () => null);