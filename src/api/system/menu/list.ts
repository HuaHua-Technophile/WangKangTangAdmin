import { customRequest } from "@/api/instance"; // 引入之前封装的请求方法
import { MenuItem } from "@/types/menuItem";

// 定义接口请求的参数类型
interface GetMenuListParams {
  menuName?: string; // 可选参数
  menuType?: string; // 可选参数
  orderNum?: number; // 可选参数
}

// 封装获取菜单列表的请求方法
export const getMenuList = (params: GetMenuListParams) => {
  return customRequest<MenuItem[]>(
    {
      method: "get", // 请求方法
      url: "/system/menu/list", // API 路径
      params, // 将参数传递给请求
    },
    "获取菜单列表"
  ); // 调用二次封装的请求方法
};
