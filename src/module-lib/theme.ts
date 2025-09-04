/* ----------------------------------------------------------------------------
// src\module-lib\theme.ts
// ----------------------------------------------------------------------------
// [ src > module-lib > * ]
import {} from '~/src/module-lib/theme';
----------------------------------------------------------------------------- */

import { addTemplate } from '@nuxt/kit';
export const AddTheme = (theme: Record<string, string>) => {
  addTemplate({
    filename: 'runtime/theme.mjs',
    getContents: () => `
export const Theme = ${JSON.stringify(theme, null, 2)};
export function GetColorCode(key){
  return Theme[key] ?? '#000000';
}
`,
  });
  addTemplate({
    filename: 'types/theme.d.ts',
    getContents: () => {
      const keys = Object.keys(theme || {});
      const union = keys.length ? keys.map((k) => `'${k}'`).join(' | ') : 'never';
      return `
declare module '#build/runtime/theme' {
  export type Theme = ${union};
  export const Theme: Record<Theme, string>;
  export function GetColorCode(key: Theme): string;
}
declare module '#build/runtime/theme-internal' {
  export const theme: Record<string, string>;
  export function GetColorCode(key: string): string;
}
export type Theme = ${union};
export {}
`;
    },
  });
};
