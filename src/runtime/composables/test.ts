/* ----------------------------------------------------------------------------
// src\runtime\composables\test.ts
// ----------------------------------------------------------------------------
// [ src > runtime > composables > * ]
import {} from '~/src/runtime/composables/test';
----------------------------------------------------------------------------- */

import { defineStore } from 'pinia';
import type { Theme } from '../../runtime/utils/theme';

import { ref } from 'vue';
export const useStore = defineStore(
  'store',
  () => {
    const theme = ref<Theme>('main1');
    return { theme };
  },
  {
    persist: true,
  } as any
);
