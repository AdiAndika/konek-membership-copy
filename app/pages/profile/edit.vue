<script setup>
import { ref, onMounted, computed } from 'vue';
import { api } from '~/services/api';
import { useAuth } from '~/composables/useState';

const auth = useAuth();
const user = ref({
  full_name: '',
  email: '',
  phone: ''
});

// State untuk menangani gambar profil
const profileImageUrl = ref(null); // URL gambar untuk ditampilkan
const profileImageFile = ref(null); // File gambar yang akan di-upload
const fileInputRef = ref(null); // Referensi ke elemen <input type="file">

const isLoading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

// Menghasilkan inisial dari nama lengkap untuk fallback
const userInitials = computed(() => {
  if (!user.value.full_name) return '';
  const names = user.value.full_name.trim().split(' ');
  if (names.length > 1 && names[names.length - 1]) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return names[0] ? names[0].substring(0, 2).toUpperCase() : '';
});

// Mengambil data pengguna saat halaman dimuat
onMounted(async () => {
  if (auth.value.user && auth.value.user.id) {
    try {
      isLoading.value = true;
      const response = await api.getUserDetail(auth.value.user.id);
      if (response.data) {
        user.value.full_name = response.data.full_name;
        user.value.email = response.data.email;
        user.value.phone = response.data.phone;
        profileImageUrl.value = response.data.photo_url; 
      }
    } catch (error) {
      errorMessage.value = 'Gagal memuat data profil.';
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  }
});

// Membuka dialog pilih file
const triggerFilePicker = () => {
  fileInputRef.value.click();
};

// Menangani file yang baru dipilih
const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    profileImageFile.value = file;
    // Menampilkan pratinjau gambar yang baru dipilih
    profileImageUrl.value = URL.createObjectURL(file);
  }
};

// Mengirim semua perubahan ke API
const submitProfile = async () => {
  if (!auth.value.user || !auth.value.user.id) return;
  
  isLoading.value = true;
  successMessage.value = '';
  errorMessage.value = '';
  
  try {
    const response = await api.updateUser(auth.value.user.id, {
      full_name: user.value.full_name,
      email: user.value.email,
      photo: profileImageFile.value
    });

    successMessage.value = response.message || 'Profil berhasil diperbarui!';
    
    // --- PERBAIKAN LOGIKA ADA DI SINI ---
    if(response.data) {
      // Perbarui state lokal dengan data terbaru dari server
      auth.value.user.full_name = response.data.full_name;
      auth.value.user.email = response.data.email;

      // Cek apakah server mengirim URL foto baru.
      // Jika TIDAK, JANGAN ubah gambar yang sedang ditampilkan (pratinjau).
      if (response.data.photo_url) {
        profileImageUrl.value = response.data.photo_url;
      }
      
      // Reset file input HANYA setelah berhasil
      profileImageFile.value = null; 
    }

  } catch (error) {
    errorMessage.value = error.message || 'Gagal memperbarui profil.';
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="container mx-auto px-6 py-8">
    <div>
      <form @submit.prevent="submitProfile" class="max-w-sm mx-auto">
        
        <div class="flex flex-col items-center mb-6">
          <input 
            type="file" 
            ref="fileInputRef" 
            @change="onFileChange" 
            accept="image/*" 
            class="hidden" 
          />
          
          <div class="relative w-24 h-24">
            <img 
              v-if="profileImageUrl" 
              class="w-full h-full object-cover rounded-full border-2 border-gray-300" 
              :src="profileImageUrl" 
              alt="Foto Profil"
              @error="profileImageUrl = null" 
            />
            <div v-else class="w-24 h-24 rounded-full border-2 border-gray-300 bg-gray-200 flex items-center justify-center">
              <span class="text-3xl font-bold text-gray-500">{{ userInitials }}</span>
            </div>
          </div>
          
          <button 
            type="button" 
            @click="triggerFilePicker" 
            class="mt-4 text-sm font-semibold text-blue-600 hover:underline"
          >
            Edit Foto Profil
          </button>
        </div>

        <div v-if="successMessage" class="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-center">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-center">
          {{ errorMessage }}
        </div>

        <div class="mb-5">
          <label for="nama_lengkap" class="block mb-2 text-sm font-medium text-gray-900">Nama Lengkap</label>
          <input
            v-model="user.full_name"
            type="text"
            id="nama_lengkap"
            class="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            placeholder="Nama Lengkap Anda"
            required
          />
        </div>
        <div class="mb-5">
          <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Email</label>
          <input
            v-model="user.email"
            type="email"
            id="email"
            class="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            placeholder="email@anda.com"
            required
          />
        </div>
        <div class="mb-5">
          <label for="no_hp" class="block mb-2 text-sm font-medium text-gray-900">No. HP</label>
          <input
            :value="user.phone"
            type="tel"
            id="no_hp"
            class="bg-gray-100 border border-gray-300 text-gray-500 text-sm rounded-lg block w-full p-2.5 cursor-not-allowed"
            disabled
          />
        </div>

        <div class="flex justify-center items-center">
          <button
            type="submit"
            :disabled="isLoading"
            class="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:bg-gray-400"
          >
            {{ isLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>