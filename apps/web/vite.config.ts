import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite-plus";

export default defineConfig({
  base: "/acer-almanac/",
  plugins: [tailwindcss()],
});
