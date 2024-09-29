import { AxiosRequestConfig } from "axios";
import { customRequest } from "@/api/instance"; // 引入之前封装的请求方法
import { MenuItem } from "@/types/menuItem";

// 封装获取菜单列表的请求方法
export const addMenu = (data: MenuItem) => {
  const config: AxiosRequestConfig = {
    method: "POST", // 请求方法
    url: "/system/menu", // API 路径
    data, // 将参数传递给请求
  };

  return customRequest(config, "添加菜单"); // 调用二次封装的请求方法
};
// 封装获取菜单列表的请求方法
export const editMenu = (params: MenuItem) => {
  const config: AxiosRequestConfig = {
    method: "PUT", // 请求方法
    url: "/system/menu", // API 路径
    params, // 将参数传递给请求
  };

  return customRequest(config, "添加菜单"); // 调用二次封装的请求方法
};
