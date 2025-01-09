/**
 * @file 获取个人信息接口模块
 * @description 封装用于获取用户个人信息的 API 请求。
 * @author [Your Name]
 * @version 1.0.0
 */

import { customRequest } from "./instance";

/**
 * 获取个人信息
 * @function
 * @description 调用后端接口 `/getInfo`，通过 GET 方法获取当前用户的个人信息。
 * @example
 * getInfo().then((response) => {
 *   console.log("个人信息", response);
 * }).catch((error) => {
 *   console.error("获取个人信息失败", error);
 * });
 */
export const getInfo = () => {
  return customRequest(
    {
      url: "/getInfo",
      method: "GET",
    },
    "获取个人信息"
  );
};
