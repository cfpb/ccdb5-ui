import { defineConfig } from 'vite'
import path from 'path';
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: '/',
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern',
                loadPaths: ['node_modules', 'src']
            }
        }
    },
    plugins: [ react() ],
    resolve: {
        alias: {
            'components': path.resolve(__dirname, 'src/components'),
            'css': path.resolve(__dirname, 'src/css'),
            // 'node_modules': path.resolve(__dirname, 'node_modules'),
        }
    },
    server: {    
        open: true, // this ensures that the browser opens upon server start
        port: 3000, // this sets a port to 3000 (instead of default of 5173)
    },
});