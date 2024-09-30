import { AxiosRequestConfig } from "axios";
import { customRequest } from "@/api/instance"; // 引入之前封装的请求方法
import { MenuTreeItem } from "@/types/system/menu/menu";

// 封装获取菜单列表的请求方法
export const getMenuTreeSelect = () => {
  const config: AxiosRequestConfig = {
    method: "get", // 请求方法
    url: "/system/menu/treeselect", // API 路径
    params: {
      menuName: undefined,
      menuType: undefined,
      orderNum: undefined,
    }, // 将参数传递给请求
  };

  return customRequest<MenuTreeItem[]>(config, "获取下拉树菜单列表"); // 调用二次封装的请求方法
};
