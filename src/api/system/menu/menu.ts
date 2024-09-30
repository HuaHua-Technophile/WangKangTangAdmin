import { AxiosRequestConfig } from "axios";
import { customRequest } from "@/api/instance"; // 引入之前封装的请求方法
import { MenuItem } from "@/types/system/menu/menu";

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
export const editMenu = (data: MenuItem) => {
  const config: AxiosRequestConfig = {
    method: "PUT", // 请求方法
    url: "/system/menu", // API 路径
    data, // 将参数传递给请求
  };

  return customRequest(config, "修改菜单"); // 调用二次封装的请求方法
};

// 删除菜单函数
export const delMenu = (menuId: number) => {
  const config: AxiosRequestConfig = {
    method: "DELETE", // 使用 DELETE 方法
    url: `/system/menu/${menuId}`, // API 路径
  };

  return customRequest(config, `删除菜单`); // 调用封装的请求方法
};
