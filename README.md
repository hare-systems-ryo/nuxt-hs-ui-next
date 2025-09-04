# nuxt-hs-ui-next

.......
 
⚡️ This repository is dedicated to the ongoing migration of **nuxt-hs-ui** to **Nuxt 4**.  

> Expect experimental features, evolving APIs, and active development as we reshape the module for the next generation of Nuxt.

## Installation

```sh
npm i nuxt-hs-ui-nuxt
```

### Nuxt

```ts
import twConfig from "./tailwind.config";
export default defineNuxtConfig({
  modules: [
    //
    [
      "nuxt-hs-ui-nuxt",
      {
        prefix: {
          nuxtUi: "",
          form: "",
          interactive: "",
          layout: "",
        },
        theme:{
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
        }
      },
    ],
  ],
});
```
