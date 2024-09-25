// src/api/routes.ts
import { RouteRecordRaw } from "vue-router";
import { service } from "./instance";

export const getRouters = async (): Promise<RouteRecordRaw[]> => {
  const response = await service.get("/getRouters");
  return response.data; // 返回路由数据
};
