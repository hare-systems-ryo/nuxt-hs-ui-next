<script setup lang="ts">
/* ----------------------------------------------------------------------------
// playground\app\app.vue
// ----------------------------------------------------------------------------
// AppApp
// AppAppAppApp
---------------------------------------------------------------------------- */
const hsMisc = useHsMisc();

onMounted(() => {
  hsMisc.init();
});
</script>

<template>
  <NuxtLayout>
    <Teleport to="body">
      <!-- <Toast />
      <WindowLoader />
      <ModalBg />
      <Dialog /> -->
    </Teleport>
    <NuxtPage />
  </NuxtLayout>
</template>
