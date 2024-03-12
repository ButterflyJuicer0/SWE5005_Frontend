import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    https: {
      key: fs.readFileSync("./nusiss.icu.key"),
      cert: fs.readFileSync("./nusiss.icu.pem"),
    },
  },
  base: "/",
});
