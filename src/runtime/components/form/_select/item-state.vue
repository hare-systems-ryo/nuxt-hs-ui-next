<script setup lang="ts">
/* ----------------------------------------------------------------------------
// src\runtime\components\form\_select\item-state.vue
// ----------------------------------------------------------------------------
// _selectItemState
// _selectItemState_selectItemState
---------------------------------------------------------------------------- */

import {
  // reactive,
  // ref, //
  // watch,
  // computed,
  useId,
  // defineShortcuts,
  // // nextTick,
  // onMounted,
} from '#imports';

// [ utils ]
import type { SelectItem } from '../../../utils/select-item';
// [ composables ]
import { useHsPinia } from '../../../composables/use-pinia';
import { useHsMultiLang } from '../../../composables/use-hs-multi-lang';

type Props = {
  item: SelectItem<string | number>;
  value?: string | number | null;
};
const props = defineProps<Props>();
// ----------------------------------------------------------------------------
const multiLang = useHsMultiLang(useHsPinia());
const tx = multiLang.tx;
// ----------------------------------------------------------------------------
const uid = useId();
</script>
<template>
  <div :key="'_selectItemState' + uid" class="flex items-center gap-1 ml-auto">
    <div v-if="props.item.deleted" class="text-error text-[0.7em] leading-[1em]">
      {{ tx({ ja: '削除済', en: 'Deleted' }) }}
    </div>
    <div v-if="props.item.hidden" class="text-error text-[0.7em] leading-[1em]">
      {{ tx({ ja: '非表示', en: 'Hidden' }) }}
    </div>

    <div v-if="!!value && props.item.id === value" class="text-accent1 text-[1em] leading-[1em]">
      <i class="fa-solid fa-check"></i>
    </div>
  </div>
</template>
