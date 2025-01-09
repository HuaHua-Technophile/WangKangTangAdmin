/**
 * @file 用户登录接口模块
 * @description 封装用户登录的 API 请求方法。
 * @author [Your Name]
 * @version 1.0.0
 */

import { customRequest } from "./instance";

/**
 * 登录请求数据接口
 * @interface LoginData
 * @property {string} username 用户名
 * @property {string} password 密码
 */
interface LoginData {
  username: string;
  password: string;
}

/**
 * 用户登录
 * @function
 * @param {LoginData} data 登录请求所需的用户名和密码
 * @description 调用后端接口 `/login`，通过 POST 方法进行用户登录。
 * @example
 * const loginData = { username: "testuser", password: "123456" };
 * login(loginData).then((response) => {
 *   console.log("登录成功", response);
 * }).catch((error) => {
 *   console.error("登录失败", error);
 * });
 */
export const login = (data: LoginData) => {
  return customRequest(
    {
      url: "/login",
      method: "POST",
      data,
    },
    "登录"
  );
};
