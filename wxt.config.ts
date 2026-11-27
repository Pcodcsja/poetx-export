import { defineConfig, UserManifest } from "wxt";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  modules: ["@wxt-dev/module-vue"],
  manifest: () => {
    const m: UserManifest = {
      host_permissions: [
        "https://*.poe.game.qq.com/",
        "https://www.wegame.com.cn/",
      ],
      content_security_policy: {
        extension_pages:
          "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';",
      },
      permissions: ["storage", "cookies", "clipboardWrite"],
      web_accessible_resources: [
        {
          resources: ["trade2-main-world.js"],
          matches: ["https://*.poe.game.qq.com/*"],
        },
      ],
    };
    return m;
  },
});
