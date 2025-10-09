<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { api } from "~/services/api";
import { useAuth } from "~/composables/useState";

definePageMeta({
  layout: "default",
});

interface User {
  id: string | number;
  full_name: string;
  email: string;
  phone: string;
  photo_url?: string;
}

const auth = useAuth() as { value: { user?: User | null } };
const router = useRouter();

// State lokal untuk form
const user = ref({
  full_name: "",
  email: "",
  phone: "",
});

// State untuk menangani gambar profil
const profileImageUrl = ref<string | null>(null);
const profileImageFile = ref<File | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

// State untuk UI feedback
const isLoading = ref(true);
const successMessage = ref("");
const errorMessage = ref("");

// Fallback inisial jika tidak ada gambar
const userInitials = computed(() => {
  if (!user.value.full_name) return "";
  const names = user.value.full_name.trim().split(" ");
  if (names.length > 1 && names[names.length - 1]) {
    return `${names[0]?.[0] ?? ""}${
      names[names.length - 1]?.[0] ?? ""
    }`.toUpperCase();
  }
  return names[0] ? names[0].substring(0, 2).toUpperCase() : "";
});

// Mengambil data pengguna saat halaman dimuat
onMounted(async () => {
  if (!auth.value.user?.id) {
    return router.push("/auth/login");
  }

  try {
    const response = await api.getUserDetail(auth.value.user.id);
    if (response.data) {
      user.value.full_name = response.data.full_name;
      user.value.email = response.data.email;
      user.value.phone = response.data.phone;
      // Gunakan 'photo_url'
      profileImageUrl.value = response.data.photo_url;
    }
  } catch (error: any) {
    errorMessage.value = error.message || "Gagal memuat data profil.";
  } finally {
    isLoading.value = false;
  }
});

// Membuka dialog pilih file
const triggerFilePicker = () => {
  fileInputRef.value?.click();
};

// Menangani file yang baru dipilih
const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    profileImageFile.value = file;
    profileImageUrl.value = URL.createObjectURL(file);
  }
};

// Mengirim semua perubahan ke API
const submitProfile = async () => {
  if (!auth.value.user?.id) return;

  isLoading.value = true;
  successMessage.value = "";
  errorMessage.value = "";

  try {
    const response = await api.updateUser(auth.value.user.id, {
      full_name: user.value.full_name,
      email: user.value.email,
      photo: profileImageFile.value,
    });

    successMessage.value = response.message || "Profil berhasil diperbarui!";

    if (response.data) {
      // Perbarui state global (cookie) dengan data baru
      if (auth.value.user) {
        auth.value.user.full_name = response.data.full_name;
        auth.value.user.email = response.data.email;
      }

      // Gunakan 'photo_url'
      if (response.data.photo_url) {
        profileImageUrl.value = response.data.photo_url;
      }

      profileImageFile.value = null;
    }
  } catch (error: any) {
    errorMessage.value = error.message || "Gagal memperbarui profil.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="bg-slate-50 min-h-screen font-sans">
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg border">
        <form @submit.prevent="submitProfile">
          <div class="flex flex-col items-center mb-8">
            <input
              type="file"
              ref="fileInputRef"
              @change="onFileChange"
              accept="image/*"
              class="hidden"
            />
            <div class="relative w-28 h-28">
              <img
                v-if="profileImageUrl"
                class="w-full h-full object-cover rounded-full border-4 border-white shadow-md"
                :src="profileImageUrl"
                alt="Foto Profil"
                @error="profileImageUrl = null"
              />
              <div
                v-else
                class="w-28 h-28 rounded-full bg-slate-200 flex items-center justify-center border-4 border-white shadow-md"
              >
                <span class="text-4xl font-bold text-slate-500">{{
                  userInitials
                }}</span>
              </div>
              <button
                type="button"
                @click="triggerFilePicker"
                class="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors shadow-md border-2 border-white"
                aria-label="Edit Foto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div
            v-if="successMessage"
            class="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-center text-sm"
          >
            {{ successMessage }}
          </div>
          <div
            v-if="errorMessage"
            class="mb-4 p-3 bg-rose-100 text-rose-800 rounded-lg text-center text-sm"
          >
            {{ errorMessage }}
          </div>

          <div class="space-y-6">
            <div>
              <label
                for="nama_lengkap"
                class="block mb-2 text-sm font-medium text-slate-900"
                >Nama Lengkap</label
              >
              <input
                v-model="user.full_name"
                type="text"
                id="nama_lengkap"
                class="border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Nama Lengkap Anda"
                required
              />
            </div>
            <div>
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-slate-900"
                >Email</label
              >
              <input
                v-model="user.email"
                type="email"
                id="email"
                class="border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="email@anda.com"
                required
              />
            </div>
            <div>
              <label
                for="no_hp"
                class="block mb-2 text-sm font-medium text-slate-900"
                >No. HP</label
              >
              <input
                :value="user.phone"
                type="tel"
                id="no_hp"
                class="bg-slate-100 border border-slate-300 text-slate-500 text-sm rounded-lg block w-full p-2.5 cursor-not-allowed"
                disabled
              />
            </div>
          </div>

          <div class="mt-8 flex justify-center">
            <button
              type="submit"
              :disabled="isLoading"
              class="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-8 py-3 text-center disabled:bg-slate-400 disabled:cursor-wait"
            >
              {{ isLoading ? "Menyimpan..." : "Simpan Perubahan" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
