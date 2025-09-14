<script setup>
import NavbarLanding from '~/components/NavbarLanding.vue';
</script>

<template>
  <div>
    <NavbarLanding />
    <main>
      <slot /> </main>
    </div>
</template>