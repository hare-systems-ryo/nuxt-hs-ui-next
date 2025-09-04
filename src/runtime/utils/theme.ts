/* ----------------------------------------------------------------------------
// src\runtime\utils\theme.ts
// ----------------------------------------------------------------------------
// [ src > runtime > utils > * ]
import {} from '~/src/runtime/utils/theme';
----------------------------------------------------------------------------- */

// import { GetColorCode as _GetColorCode } from '#build/runtime/theme.mjs';
import { GetColorCode as _GetColorCode } from '#build/runtime/theme';

import type { Theme } from '#build/types/theme';

// export type { Theme } from '#build/types/theme';

export const GetColorCode = (theme: Theme): string => _GetColorCode(theme) as string;
export { GetColorCode as _GetColorCode } from '#build/runtime/theme';
export { Theme } from '#build/runtime/theme';