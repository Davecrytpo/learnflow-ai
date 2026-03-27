import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ["react", "react-dom", "react-router-dom"],
          'vendor-ui': [
            "@radix-ui/react-accordion", 
            "@radix-ui/react-alert-dialog", 
            "@radix-ui/react-avatar", 
            "@radix-ui/react-checkbox", 
            "@radix-ui/react-dialog", 
            "@radix-ui/react-dropdown-menu", 
            "@radix-ui/react-popover", 
            "@radix-ui/react-select", 
            "@radix-ui/react-tabs", 
            "@radix-ui/react-toast",
            "lucide-react",
            "framer-motion"
          ],
          'vendor-utils': ["date-fns", "clsx", "tailwind-merge"],
          'vendor-editor': ["@tiptap/react", "@tiptap/starter-kit", "dompurify"],
        },
      },
    },
  },
}));
