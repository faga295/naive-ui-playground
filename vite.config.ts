import * as path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import { presetAttributify, presetUno } from 'unocss'
import AutoImport from 'unplugin-auto-import/vite'

const pathSrc = path.resolve(__dirname, 'src')
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': pathSrc,
    },
  },
  plugins: [
    vue({
      reactivityTransform: true
    }),
    AutoImport({
        imports: ['vue'],
        dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
      }),
    Unocss({
      presets: [
        presetAttributify(),
        presetUno(),
      ]
    })
  ]
})
