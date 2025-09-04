<script setup lang="ts">
/* ----------------------------------------------------------------------------
// playground\app\pages\index.vue
// ----------------------------------------------------------------------------
// AppPages
// AppPagesAppPages
---------------------------------------------------------------------------- */
const hsMisc = useHsMisc(useHsPinia());

onMounted(() => {
  hsMisc.init();
});
</script>

<template>
  <Container fluid>
    <Main></Main>
    <!-- <Breadcrumb :links="linkList"></Breadcrumb> -->
  </Container>
</template>
