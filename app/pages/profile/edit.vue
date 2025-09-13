<template>
  <div class="container mx-auto px-6 py-8">
    <div>
      <form class="max-w-sm mx-auto">
        <div class="flex flex-col items-center mb-6">
          <div
            class="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300"
          >
            <img
              class="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1534294668821-28a3054f4256?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
          </div>
        </div>
        <div class="mb-5">
          <label for="nama" class="block mb-2 text-sm font-medium text-gray-900"
            >Nama</label
          >
          <input
            type="text"
            id="nama"
            class="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            placeholder="Kadek"
            required
          />
        </div>
        <div class="mb-5">
          <label
            for="nama_lengkap"
            class="block mb-2 text-sm font-medium text-gray-900"
            >Nama Lengkap</label
          >
          <input
            type="text"
            id="nama_lengkap"
            class="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            placeholder="Kadek Gandi Taruna Wijaya"
            required
          />
        </div>
        <div class="mb-5">
          <label
            for="no_hp"
            class="block mb-2 text-sm font-medium text-gray-900"
            >No. HP</label
          >
          <input
            type="number"
            id="no_hp"
            class="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            placeholder="085***********"
            required
          />
        </div>
        <div class="flex justify-center items-center">
          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
