import { useState } from "#app";

// State untuk menyimpan detail checkout link dan waktu kedaluwarsa
// agar bisa diakses di halaman /payment/pay
export const usePaymentState = () =>
  useState("paymentState", () => ({
    link: null, // Akan berisi checkout_link
    expiry: null, // Akan berisi expiry_date
  }));
