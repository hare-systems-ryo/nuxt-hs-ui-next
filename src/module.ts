/* ----------------------------------------------------------------------------
// src\module.ts
// ----------------------------------------------------------------------------
// [ src > * ]
import {} from '~/src/module';
----------------------------------------------------------------------------- */

import { AddTheme } from './module-lib/theme';
import { AddCss } from './module-lib/css';

import {
  defineNuxtModule, //
  // addPlugin,
  createResolver,
  addComponentsDir,
  addImportsDir,
  // installModule,
  // addTemplate,
  // hasNuxtModuleCompatibility,
  // addImports,
} from '@nuxt/kit';

// import { defu } from 'defu';

// import type { TailwindConfig } from 'tailwindcss/tailwind.config';

// Module options TypeScript interface definition
export interface ModuleOptions {
  theme: Record<string, string>;
}

export interface ModuleOptions {
  prefix: {
    nuxtUi: string;
    form: string;
    interactive: string;
    layout: string;
    misc: string;
  };
  theme: Record<string, string>;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'my-module',
    configKey: 'myModule',
    dependencies: [
      '@nuxt/ui', //
      '@vueuse/nuxt',
      '@pinia/nuxt',
      'pinia-plugin-persistedstate/nuxt',
    ],
    compatibility: {
      nuxt: '>=4.0.0',
    },
  },
  // Default configuration options of the Nuxt module
  defaults: {
    prefix: {
      nuxtUi: '',
      form: '',
      interactive: '',
      layout: '',
      misc: '',
    },
    theme: {
      main0: '#183C5E',
      main1: '#2C5A85',
      main2: '#487CB4',
      main3: '#A7CDED',
      main4: '#C4E1FF',
      accent1: '#FF6600',
      accent2: '#FFAC7C',
      info: '#2BABB5',
      link: '#6200EE',
      download: '#11691F',
      success: '#2BB60C',
      warn: '#EAB000',
      error: '#D80329',
      dark: '#224466',
      back: '#EDF2F7',
      back2: '#AABED1',
      white: '#FFFFFF',
    },
    // tw: defaultTwConfig,
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    // const runtimeDir = resolve('./runtime');
    // const isDevelopment = runtimeDir.endsWith('src/runtime') || runtimeDir.endsWith('src\\runtime');
    // const extension = isDevelopment ? 'scss' : 'css';
    // console.log('nuxt module setup', options);
    // nuxt.options.runtimeConfig.public ||= {};
    // nuxt.options.runtimeConfig.public.theme = { theme: options.theme || {} };
    AddTheme(options.theme);
    addComponentsDir({
      path: resolve('runtime/components/form'),
      prefix: options.prefix.form,
    });
    addComponentsDir({
      path: resolve('runtime/components/layout'),
      prefix: options.prefix.layout,
    });
    addImportsDir(resolve('runtime/composables'));
    // -------------------------
    // const twReqConfig = {
    //   content: {
    //     files: [
    //       //
    //       resolve('./runtime/components/**/*.{vue,mjs,ts}'),
    //       resolve('./runtime/**/*.{mjs,js,ts}'),
    //     ],
    //   },
    // };
    // const twConfig = defu(twReqConfig, defu(_options.tw, defaultTwConfig));

    // -------------------------
    // console.log((_nuxt.options as any).tailwindcss);
    // await installModule("@pinia/nuxt", { disableVuex: true });
    // await installModule('@vueuse/nuxt');

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    // addPlugin(resolver.resolve('./runtime/plugin'));
    // _nuxt.options.css.push(resolve(runtimeDir, `style.css`));
    // nuxt.options.css.push(resolve('./runtime/assets/main.css'));
    // nuxt.options.css.push(resolve('./runtime/assets/tailwind-extends.css'));
    AddCss(nuxt, resolve, { mode: 'bundle' });

    // Tailwind の content.files に runtime ディレクトリを追加
    // (_nuxt.hook as any)('tailwindcss:config', (config: any) => {
    //   console.log('hook hear')
    //   config.content.files.push(
    //     resolve('./runtime/components/**/*.{vue,mjs,ts}'),
    //     resolve('./runtime/**/*.{mjs,js,ts}')
    //   );
    // });
  },
});
