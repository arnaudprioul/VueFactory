import { resolve } from 'path'

import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [
        vue(),
        dts({
            tsconfigPath: './tsconfig.app.json',
            cleanVueFileName: true,
            insertTypesEntry: true,
        }),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'VueFactoryPageBuilder',
            fileName: 'vue-factory-page-builder',
            formats: ['es', 'cjs'],
        },
        rollupOptions: {
            external: ['vue', /^vue\//],
            output: {
                globals: {
                    vue: 'Vue',
                },
            },
        },
    },
})
