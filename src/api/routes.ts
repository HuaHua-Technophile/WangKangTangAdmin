/**
 * @file 动态路由接口模块
 * @description 封装用于获取动态路由的 API 请求方法，返回后端定义的路由信息。
 * @author [Your Name]
 * @version 1.0.0
 */

import { RouteRecordRaw } from "vue-router";
import { customRequest } from "./instance";

/**
 * 获取动态路由
 * @function
 * @description 调用后端接口 `/getRouters`，通过 GET 方法获取动态路由信息。
 * @example
 * getRouters().then((routes) => {
 *   console.log("动态路由", routes);
 * }).catch((error) => {
 *   console.error("获取动态路由失败", error);
 * });
 */
export const getRouters = () => {
  return customRequest<RouteRecordRaw[]>(
    {
      url: "/getRouters",
      method: "GET",
    },
    "获取动态路由"
  );
};
