import { AxiosRequestConfig } from "axios";
import { customRequest } from "@/api/instance"; // 引入之前封装的请求方法

// 定义接口请求的参数类型
interface GetMenuListParams {
  menuName?: string; // 可选参数
  menuType?: string; // 可选参数
  orderNum?: number; // 可选参数
}

// 封装获取菜单列表的请求方法
export const getMenuTreeSelect = (params: GetMenuListParams) => {
  const config: AxiosRequestConfig = {
    method: "get", // 请求方法
    url: "/system/menu/treeselect", // API 路径
    params, // 将参数传递给请求
  };

  return customRequest(config, "获取下拉树菜单列表"); // 调用二次封装的请求方法
};
