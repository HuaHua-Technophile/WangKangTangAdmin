/**
 * Vite 配置文件
 * @description 配置 Vite 构建工具的各项功能，包括插件、CSS 预处理、路径别名等
 * @see {@link https://vitejs.dev/config/} Vite配置文档
 */

import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
// import ElementPlus from "unplugin-element-plus/vite";

export default defineConfig({
  /** @description 配置 Vite 插件 */
  plugins: [
    /** @description 启用 Vue 3 支持 */
    vue(),
    /**
     * @description 自动导入 API 配置
     * @see {@link https://github.com/antfu/unplugin-auto-import}
     */
    AutoImport({
      resolvers: [ElementPlusResolver()],
      /**
       * @description 配置需要自动导入的模块
       * @type {Array<string | Record<string, string[]>>}
       */
      imports: [
        "vue", // 自动导入ref,reactive,onMounted等
        "vue-router", // 自动导入路由相关api
        { "@/utils/debug": ["debugLog", "debugWarn", "debugError"] }, // 自动导入 debug
      ],
      /** @description 生成类型声明文件 */
      dts: true, // 这将生成 'auto-imports.d.ts' 文件
    }),
    /**
     * @description 自动导入组件配置
     * @see {@link https://github.com/antfu/unplugin-vue-components}
     */
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: "sass",
          /** @description 自动导入 Element Plus 的指令 */
          directives: true,
          // version: "2.1.5",
        }),
      ],
    }),
    /* ElementPlus({
      useSource: true,
    }), */
  ],

  /**
   * @description CSS 相关配置
   * @see {@link https://vitejs.dev/config/shared-options.html#css}
   */
  css: {
    preprocessorOptions: {
      scss: {
        /** @description 全局引入自定义 Element Plus 主题样式 */
        additionalData: `@use "@/style/customElementPlusLight.scss" as *;`,
      },
    },
  },

  /**
   * @description 定义全局常量替换方式
   * @see {@link https://vitejs.dev/config/shared-options.html#define}
   */
  define: {},

  /**
   * @description 解析配置
   * @see {@link https://vitejs.dev/config/shared-options.html#resolve}
   */
  resolve: {
    /* alias: [
      {
        find: "@",
        replacement: "/src",
      },
    ],
    extensions: [".ts", ".js", ".vue", ".json"], */

    /**
     * @description 路径别名配置
     * @example import { foo } from '@/components/foo'
     */
    alias: {
      "@/": `${path.resolve(__dirname, "src")}/`,
    },
  },

  /**
   * @description 构建配置
   * @see {@link https://vitejs.dev/config/build-options.html}
   */
  build: {
    /** @description 设置构建目标的 ES 版本 */
    target: "esnext", // 或者更高版本 'esnext'
  },
});
