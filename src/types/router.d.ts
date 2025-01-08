// types/router.ts
import "vue-router";
import { RouteRecordRaw } from "vue-router";
// 扩展 vue-router 模块
declare module "vue-router" {
  interface RouteRecordRaw {
    hidden?: boolean;
  }
}
export type CustomRouteRecordRaw = RouteRecordRaw & {
  hidden?: boolean;
};
