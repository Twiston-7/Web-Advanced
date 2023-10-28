// vite.config.js
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
    plugins: [svelte()],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('client/')) {
                        return id.split('/client/')[1].split('/').slice(0, -1).join('/');
                    }
                },
            },
        },
    },
})
