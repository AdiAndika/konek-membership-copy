// app/middleware/auth.global.ts

export default defineNuxtRouteMiddleware((to, from) => {
  // Ambil state autentikasi dari cookie
  const auth = useAuth();

  // Daftar halaman yang hanya bisa diakses jika BELUM login
  const guestRoutes = ['/auth/login', '/auth/register', '/auth/otp', '/'];

  // Jika pengguna BELUM login (tidak ada token)
  if (!auth.value.token) {
    // Dan mencoba mengakses halaman selain halaman publik (guest routes)
    if (!guestRoutes.includes(to.path)) {
      // Alihkan paksa ke halaman landing
      console.log('Middleware: Tidak login, mengalihkan ke landing page');
      return navigateTo('/');
    }
  }
  
  // Jika pengguna SUDAH login (ada token)
  if (auth.value.token) {
    // Dan mencoba mengakses halaman login/register
    if (guestRoutes.includes(to.path)) {
      // Alihkan paksa ke halaman dashboard
      console.log('Middleware: Sudah login, mengalihkan ke dashboard');
      return navigateTo('/dashboard/membership/non-aktif');
    }
  }
});