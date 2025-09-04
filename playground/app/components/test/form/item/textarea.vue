<script setup lang="ts">
/* ----------------------------------------------------------------------------
// playground\app\components\test\form\item\textarea.vue
// ----------------------------------------------------------------------------
// AppComponentsTestFormItemTextarea
// AppComponentsTestFormItemTextareaAppComponentsTestFormItemTextarea
---------------------------------------------------------------------------- */

const textA = ref('textA');
const textB = ref('textB');
</script>
<template>
  <Card class="mt-4">
    <CardItem class="" variant="header"> Textarea </CardItem>
    <CardItem class="" variant="body">
      <!-- ------------------------------------------------ -->
      <div>通常</div>
      <div class="grid grid-cols-2 gap-1">
        <Textarea v-model:data="textA" :diff="textB" size="m" label="autosize" rows="3" autosize />
        <Textarea v-model:data="textA" :diff="textB" size="m" label="ラベル付き" rows="3" />
      </div>
      <!-- ------------------------------------------------ -->
      <div class="p-1"></div>
      <div>文字数制限</div>
      <Textarea v-model:data="textB" size="m" label="文字数制限" :max-len="30" />
      <!-- ------------------------------------------------ -->
      <div class="p-1"></div>
      <div>行数制限</div>
      <Textarea v-model:data="textB" size="m" label="文字数制限" :max-rows="6" />
      <!-- ------------------------------------------------ -->
      <div class="p-1"></div>
      <div>文字数制限 + 行数制限</div>
      <Textarea v-model:data="textB" size="m" label="文字数制限" :max-rows="6" :max-len="30" />
      <!-- ------------------------------------------------ -->
    </CardItem>
  </Card>
</template>
