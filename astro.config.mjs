import { defineConfig } from "astro/config";
import basicSsl from "@vitejs/plugin-basic-ssl";
import tailwind from "@astrojs/tailwind";
import vue from "@astrojs/vue";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:4321',
  i18n: {
    defaultLocale: "en",
    locales: ["en", "sv"],
    routing: {
      prefixDefaultLocale: true,
      strategy: "pathname"
    }
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    vue({
      appEntrypoint: "/src/pages/_app",
    }),
    icon(),
    sitemap(),
  ],
  trailingSlash: "ignore",
  compressHTML: true,
  scopedStyleStrategy: "attribute",
  build: {
    format: "directory",
    inlineStylesheets: "always",
  },
  vite: {
    plugins: [basicSsl()],
    server: {
      https: true,
    },
  },
  experimental: {
    
  },
});
