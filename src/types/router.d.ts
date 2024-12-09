// types/router.ts
import { RouteRecordRaw as _RouteRecordRaw } from "vue-router";

export interface CustomRouteRecordRaw extends _RouteRecordRaw {
  hidden?: boolean;
}
