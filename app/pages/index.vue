<template>
  <header>
    <div class="container px-4 lg:px-12 py-3">
      <div class="flex justify-between items-center">
        <a href="/">
          <img class="h-10" src="~/assets/images/logo-konek-biru.png" alt="" />
        </a>
        <div>
          <a href="/auth/login">
            <button
              id="login"
              class="text-white font-bold text-lg py-1.5 px-10 rounded-full transition-colors"
            >
              Login
            </button>
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap");
#login {
  background: linear-gradient(
    107deg,
    #3ef7f7 2.61%,
    #0080ff 51.9%,
    #30c1ff 101.2%
  );
}
</style>
