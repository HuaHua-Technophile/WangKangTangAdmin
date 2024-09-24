import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import ElementPlus from "unplugin-element-plus/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: [
        // 自动导入 debug
        { "@/utils/debug": ["debugLog", "debugWarn", "debugError"] },
      ],
      dts: true, // 这将生成 'auto-imports.d.ts' 文件
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    ElementPlus({
      useSource: true,
    }), //https://element-plus.org/zh-CN/guide/theming.html#%E5%A6%82%E4%BD%95%E8%A6%86%E7%9B%96%E5%AE%83%EF%BC%9F 如何按需导入的情况下仍然支持自定义主题色
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @use "@/style/customElementPlusLight.scss" as *;`,
      },
    },
  },
  define: {},
  // 路径别名
  resolve: {
    /* alias: [
      {
        find: "@",
        replacement: "/src",
      },
    ],
    extensions: [".ts", ".js", ".vue", ".json"], */
    alias: {
      "@/": `${path.resolve(__dirname, "src")}/`,
    },
  },
});
