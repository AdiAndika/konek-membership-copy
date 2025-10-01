<script setup>
import { onMounted } from 'vue';
import { api } from '~/services/api';
import { useAuth } from '~/composables/useState';

// Gunakan layout default yang memiliki Navbar dan Footer
definePageMeta({
  layout: "default",
});

const auth = useAuth();
const router = useRouter();

onMounted(async () => {
  if (!auth.value.user || !auth.value.user.id) {
    // Jika karena suatu alasan data pengguna tidak ada, arahkan ke login
    return router.push('/auth/login');
  }

  try {
    // Panggil API untuk mendapatkan detail membership
    const response = await api.getMembershipDetail(auth.value.user.id);

    // Cek status dari respons API
    if (response.data && response.data.status) {
      const status = response.data.status.toLowerCase();
      
      if (status === 'active') {
        router.replace('/dashboard/membership/aktif');
      } else if (status === 'pending') {
        router.replace('/dashboard/membership/pending');
      } else {
        // Untuk status lain (expired, etc.), arahkan ke non-aktif
        router.replace('/dashboard/membership/non-aktif');
      }
    } else {
      // Jika tidak ada data membership, berarti non-aktif
      router.replace('/dashboard/membership/non-aktif');
    }
  } catch (error) {
    console.error("Gagal memeriksa status membership:", error);
    // Jika terjadi error (misal: 404 Not Found), anggap membership tidak ada
    router.replace('/dashboard/membership/non-aktif');
  }
});
</script>

<template>
  <div class="flex justify-center items-center min-h-[60vh]">
    <div class="text-center">
      <p class="text-lg font-semibold text-gray-700">
        Mengecek status membership Anda...
      </p>
    </div>
  </div>
</template>