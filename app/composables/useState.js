// app/composables/useState.js
import { useState } from '#app';

export const usePhoneNumber = () => useState('phoneNumber', () => null);

// State untuk menyimpan data user dan token setelah login
export const useAuth = () => useCookie('auth', {
  default: () => ({
    user: null,
    token: null,
  }),
  // Cookie akan berlaku selama 1 minggu
  maxAge: 60 * 60 * 24 * 7,
});