import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        cv: resolve(__dirname, "index.html"),
        profile: resolve(__dirname, "gioithieu.html"),
        calculator: resolve(__dirname, "maytinh.html"),
      },
    },
  },
});
