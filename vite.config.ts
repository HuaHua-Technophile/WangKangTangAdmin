import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
// import ElementPlus from "unplugin-element-plus/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: [
        "vue", //自动导入ref,reactive,onMounted等
        "vue-router", //自动导入路由相关api
        { "@/utils/debug": ["debugLog", "debugWarn", "debugError"] }, // 自动导入 debug
      ],
      dts: true, // 这将生成 'auto-imports.d.ts' 文件
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: "sass",
          directives: true, //自动导入 Element Plus 的指令（如 v-loading、v-tooltip 等）
          // version: "2.1.5",
        }),
      ],
    }),
    /* ElementPlus({
      useSource: true,
    }), */
    /*如何按需导入的情况下仍然让亮色模式下,支持自定义主题色?
    因为按需导入时,仅导入每个组件的style,而在全局main.ts中写的scss覆盖就不会生效
    如果要在vite按需导入的同时修改elementPlus主题色,必须写明以下css内容

    https://juejin.cn/post/7264952002706096164#heading-3
    
    https://element-plus.org/zh-CN/guide/theming.html#%E5%A6%82%E4%BD%95%E8%A6%86%E7%9B%96%E5%AE%83%EF%BC%9F */
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/style/customElementPlusLight.scss" as *;`,
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
  build: {
    target: "es2022", // 或者更高版本 'esnext'
  },
});
