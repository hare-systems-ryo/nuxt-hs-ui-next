/* ----------------------------------------------------------------------------
// src\runtime\plugin\v-select.ts
// ----------------------------------------------------------------------------
// [ src > runtime > plugin > * ]
import {} from '~/src/runtime/plugin/v-select';
----------------------------------------------------------------------------- */

import { defineNuxtPlugin } from "#imports";
import vSelect from "vue-select";
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("v-select", vSelect as any);
});
