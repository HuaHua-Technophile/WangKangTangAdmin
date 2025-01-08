// vite.config.ts
import { defineConfig } from "file:///C:/B/WangKangTangAdmin/node_modules/.pnpm/vite@5.4.11_@types+node@22.10.5_sass@1.83.1/node_modules/vite/dist/node/index.js";
import path from "path";
import vue from "file:///C:/B/WangKangTangAdmin/node_modules/.pnpm/@vitejs+plugin-vue@5.2.1_vite@5.4.11_@types+node@22.10.5_sass@1.83.1__vue@3.5.13_typescript@5.7.2_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import AutoImport from "file:///C:/B/WangKangTangAdmin/node_modules/.pnpm/unplugin-auto-import@0.18.6_@nuxt+kit@3.15.1_rollup@4.30.0__@vueuse+core@9.13.0_vue@3.5.13_ty_fgk4oleqsabjkeoiodq2v7p37y/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///C:/B/WangKangTangAdmin/node_modules/.pnpm/unplugin-vue-components@0.27.5_@babel+parser@7.26.3_@nuxt+kit@3.15.1_rollup@4.30.0__rollup@4._s2wfd4jvas7erjvk5efey2c4pe/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///C:/B/WangKangTangAdmin/node_modules/.pnpm/unplugin-vue-components@0.27.5_@babel+parser@7.26.3_@nuxt+kit@3.15.1_rollup@4.30.0__rollup@4._s2wfd4jvas7erjvk5efey2c4pe/node_modules/unplugin-vue-components/dist/resolvers.js";
var __vite_injected_original_dirname = "C:\\B\\WangKangTangAdmin";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: [
        "vue",
        //自动导入ref,reactive,onMounted等
        "vue-router",
        //自动导入路由相关api
        { "@/utils/debug": ["debugLog", "debugWarn", "debugError"] }
        // 自动导入 debug
      ],
      dts: true
      // 这将生成 'auto-imports.d.ts' 文件
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: "sass",
          directives: true
          //自动导入 Element Plus 的指令（如 v-loading、v-tooltip 等）
          // version: "2.1.5",
        })
      ]
    })
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
        additionalData: `@use "@/style/customElementPlusLight.scss" as *;`
      }
    }
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
      "@/": `${path.resolve(__vite_injected_original_dirname, "src")}/`
    }
  },
  build: {
    target: "esnext"
    // 或者更高版本 'esnext'
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxCXFxcXFdhbmdLYW5nVGFuZ0FkbWluXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxCXFxcXFdhbmdLYW5nVGFuZ0FkbWluXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9CL1dhbmdLYW5nVGFuZ0FkbWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgdnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIjtcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gXCJ1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlXCI7XG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZVwiO1xuaW1wb3J0IHsgRWxlbWVudFBsdXNSZXNvbHZlciB9IGZyb20gXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnNcIjtcbi8vIGltcG9ydCBFbGVtZW50UGx1cyBmcm9tIFwidW5wbHVnaW4tZWxlbWVudC1wbHVzL3ZpdGVcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgICBBdXRvSW1wb3J0KHtcbiAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV0sXG4gICAgICBpbXBvcnRzOiBbXG4gICAgICAgIFwidnVlXCIsIC8vXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1cmVmLHJlYWN0aXZlLG9uTW91bnRlZFx1N0I0OVxuICAgICAgICBcInZ1ZS1yb3V0ZXJcIiwgLy9cdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcdThERUZcdTc1MzFcdTc2RjhcdTUxNzNhcGlcbiAgICAgICAgeyBcIkAvdXRpbHMvZGVidWdcIjogW1wiZGVidWdMb2dcIiwgXCJkZWJ1Z1dhcm5cIiwgXCJkZWJ1Z0Vycm9yXCJdIH0sIC8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NSBkZWJ1Z1xuICAgICAgXSxcbiAgICAgIGR0czogdHJ1ZSwgLy8gXHU4RkQ5XHU1QzA2XHU3NTFGXHU2MjEwICdhdXRvLWltcG9ydHMuZC50cycgXHU2NTg3XHU0RUY2XG4gICAgfSksXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICByZXNvbHZlcnM6IFtcbiAgICAgICAgRWxlbWVudFBsdXNSZXNvbHZlcih7XG4gICAgICAgICAgaW1wb3J0U3R5bGU6IFwic2Fzc1wiLFxuICAgICAgICAgIGRpcmVjdGl2ZXM6IHRydWUsIC8vXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1IEVsZW1lbnQgUGx1cyBcdTc2ODRcdTYzMDdcdTRFRTRcdUZGMDhcdTU5ODIgdi1sb2FkaW5nXHUzMDAxdi10b29sdGlwIFx1N0I0OVx1RkYwOVxuICAgICAgICAgIC8vIHZlcnNpb246IFwiMi4xLjVcIixcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pLFxuICAgIC8qIEVsZW1lbnRQbHVzKHtcbiAgICAgIHVzZVNvdXJjZTogdHJ1ZSxcbiAgICB9KSwgKi9cbiAgICAvKlx1NTk4Mlx1NEY1NVx1NjMwOVx1OTcwMFx1NUJGQ1x1NTE2NVx1NzY4NFx1NjBDNVx1NTFCNVx1NEUwQlx1NEVDRFx1NzEzNlx1OEJBOVx1NEVBRVx1ODI3Mlx1NkEyMVx1NUYwRlx1NEUwQixcdTY1MkZcdTYzMDFcdTgxRUFcdTVCOUFcdTRFNDlcdTRFM0JcdTk4OThcdTgyNzI/XG4gICAgXHU1NkUwXHU0RTNBXHU2MzA5XHU5NzAwXHU1QkZDXHU1MTY1XHU2NUY2LFx1NEVDNVx1NUJGQ1x1NTE2NVx1NkJDRlx1NEUyQVx1N0VDNFx1NEVGNlx1NzY4NHN0eWxlLFx1ODAwQ1x1NTcyOFx1NTE2OFx1NUM0MG1haW4udHNcdTRFMkRcdTUxOTlcdTc2ODRzY3NzXHU4OTg2XHU3NkQ2XHU1QzMxXHU0RTBEXHU0RjFBXHU3NTFGXHU2NTQ4XG4gICAgXHU1OTgyXHU2NzlDXHU4OTgxXHU1NzI4dml0ZVx1NjMwOVx1OTcwMFx1NUJGQ1x1NTE2NVx1NzY4NFx1NTQwQ1x1NjVGNlx1NEZFRVx1NjUzOWVsZW1lbnRQbHVzXHU0RTNCXHU5ODk4XHU4MjcyLFx1NUZDNVx1OTg3Qlx1NTE5OVx1NjYwRVx1NEVFNVx1NEUwQmNzc1x1NTE4NVx1NUJCOVxuXG4gICAgaHR0cHM6Ly9qdWVqaW4uY24vcG9zdC83MjY0OTUyMDAyNzA2MDk2MTY0I2hlYWRpbmctM1xuICAgIFxuICAgIGh0dHBzOi8vZWxlbWVudC1wbHVzLm9yZy96aC1DTi9ndWlkZS90aGVtaW5nLmh0bWwjJUU1JUE2JTgyJUU0JUJEJTk1JUU4JUE2JTg2JUU3JTlCJTk2JUU1JUFFJTgzJUVGJUJDJTlGICovXG4gIF0sXG4gIGNzczoge1xuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgIHNjc3M6IHtcbiAgICAgICAgYWRkaXRpb25hbERhdGE6IGBAdXNlIFwiQC9zdHlsZS9jdXN0b21FbGVtZW50UGx1c0xpZ2h0LnNjc3NcIiBhcyAqO2AsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIGRlZmluZToge30sXG4gIC8vIFx1OERFRlx1NUY4NFx1NTIyQlx1NTQwRFxuICByZXNvbHZlOiB7XG4gICAgLyogYWxpYXM6IFtcbiAgICAgIHtcbiAgICAgICAgZmluZDogXCJAXCIsXG4gICAgICAgIHJlcGxhY2VtZW50OiBcIi9zcmNcIixcbiAgICAgIH0sXG4gICAgXSxcbiAgICBleHRlbnNpb25zOiBbXCIudHNcIiwgXCIuanNcIiwgXCIudnVlXCIsIFwiLmpzb25cIl0sICovXG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQC9cIjogYCR7cGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmNcIil9L2AsXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICB0YXJnZXQ6IFwiZXNuZXh0XCIsIC8vIFx1NjIxNlx1ODAwNVx1NjZGNFx1OUFEOFx1NzI0OFx1NjcyQyAnZXNuZXh0J1xuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTBQLFNBQVMsb0JBQW9CO0FBQ3ZSLE9BQU8sVUFBVTtBQUNqQixPQUFPLFNBQVM7QUFDaEIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUywyQkFBMkI7QUFMcEMsSUFBTSxtQ0FBbUM7QUFTekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osV0FBVztBQUFBLE1BQ1QsV0FBVyxDQUFDLG9CQUFvQixDQUFDO0FBQUEsTUFDakMsU0FBUztBQUFBLFFBQ1A7QUFBQTtBQUFBLFFBQ0E7QUFBQTtBQUFBLFFBQ0EsRUFBRSxpQkFBaUIsQ0FBQyxZQUFZLGFBQWEsWUFBWSxFQUFFO0FBQUE7QUFBQSxNQUM3RDtBQUFBLE1BQ0EsS0FBSztBQUFBO0FBQUEsSUFDUCxDQUFDO0FBQUEsSUFDRCxXQUFXO0FBQUEsTUFDVCxXQUFXO0FBQUEsUUFDVCxvQkFBb0I7QUFBQSxVQUNsQixhQUFhO0FBQUEsVUFDYixZQUFZO0FBQUE7QUFBQTtBQUFBLFFBRWQsQ0FBQztBQUFBLE1BQ0g7QUFBQSxJQUNGLENBQUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBV0g7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNILHFCQUFxQjtBQUFBLE1BQ25CLE1BQU07QUFBQSxRQUNKLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVEsQ0FBQztBQUFBO0FBQUEsRUFFVCxTQUFTO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQVFQLE9BQU87QUFBQSxNQUNMLE1BQU0sR0FBRyxLQUFLLFFBQVEsa0NBQVcsS0FBSyxDQUFDO0FBQUEsSUFDekM7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUE7QUFBQSxFQUNWO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
