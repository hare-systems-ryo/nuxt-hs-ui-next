<script setup lang="ts">
/* ----------------------------------------------------------------------------
// src\runtime\components\form\_select\item-label.vue
// ----------------------------------------------------------------------------
// _selectItemLabel
// _selectItemLabel_selectItemLabel
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

type Props = {
  item: SelectItem<string | number>;
  overflow?: boolean;
};
const props = defineProps<Props>();
// ----------------------------------------------------------------------------
const text = props.item.text || '';
const uid = useId();
</script>
<template>
  <div
    :key="uid + text"
    class="min-w-0 flex-1"
    :class="props.overflow ? 'whitespace-pre-line break-all' : 'truncate'"
    :title="String(props.item.text)"
  >
    {{ props.item.text }}
  </div>
</template>
