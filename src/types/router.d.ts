// types/router.ts
import "vue-router";

// 扩展 vue-router 模块
declare module "vue-router" {
  interface RouteRecordRaw {
    hidden?: boolean;
  }
}
