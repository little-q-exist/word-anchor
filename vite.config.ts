import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [reactRouter(), devtoolsJson()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@modules': path.resolve(__dirname, './src/modules'),
            '@shared': path.resolve(__dirname, './src/shared'),
        },
    },
});
