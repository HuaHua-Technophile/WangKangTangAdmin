// src/api/routes.ts
import { RouteRecordRaw } from "vue-router";
import { customRequest } from "./instance";

export const getRouters = () => {
  return customRequest<RouteRecordRaw[]>(
    {
      url: "/getRouters",
      method: "GET",
    },
    "获取动态路由"
  );
};
