import { customRequest } from "@/api/instance"; // 引入之前封装的请求方法
import { GetMenuListParams, MenuItem, MenuTreeItem } from "@/types/system/menu";

// 封装获取菜单列表的请求方法
export const addMenu = (data: MenuItem) => {
  return customRequest(
    {
      method: "POST", // 请求方法
      url: "/system/menu", // API 路径
      data, // 将参数传递给请求
    },
    "添加菜单"
  );
};
// 封装获取菜单列表的请求方法
export const editMenu = (data: MenuItem) => {
  return customRequest(
    {
      method: "PUT", // 请求方法
      url: "/system/menu", // API 路径
      data, // 将参数传递给请求
    },
    "修改菜单"
  ); // 调用二次封装的请求方法
};

// 删除菜单函数
export const delMenu = (menuId: number) => {
  return customRequest(
    {
      method: "DELETE", // 使用 DELETE 方法
      url: `/system/menu/${menuId}`, // API 路径
    },
    `删除菜单`
  ); // 调用封装的请求方法
};

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

// 封装获取菜单树列表的请求方法
export const getMenuTreeSelect = () => {
  return customRequest<MenuTreeItem[]>(
    {
      method: "get", // 请求方法
      url: "/system/menu/treeselect", // API 路径
      params: {
        menuName: undefined,
        menuType: undefined,
        orderNum: undefined,
      }, // 将参数传递给请求
    },
    "获取下拉树菜单列表"
  ); // 调用二次封装的请求方法
};
