import { defineConfig } from "vite";
import path from "path";
import autoprefixer from "autoprefixer";
import mkcert from "vite-plugin-mkcert";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    base: "./",
    build: {
        outDir: "minesweeper",
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        open: true,
    },
    plugins: [
        mkcert(),
        react(),
    ],
    css: {
        postcss: {
            plugins: [
                autoprefixer(),
            ],
        },
    },
});
