import { customRequest } from "@/api/instance";
import { MenuTreeItem } from "@/types/system/menu";
import { GetRoleListParams, RoleItem } from "@/types/system/role";

// 封装获取菜单列表的请求方法
export const getRoleList = (params: GetRoleListParams) => {
  return customRequest<RoleItem[]>(
    {
      method: "get", // 请求方法
      url: "/system/role/list", // API 路径
      params, // 将参数传递给请求
    },
    "获取角色列表"
  ); // 调用二次封装的请求方法
};

// 封装获取菜单列表的请求方法
export const addRole = (data: RoleItem) => {
  return customRequest(
    {
      method: "POST", // 请求方法
      url: "/system/role", // API 路径
      data, // 将参数传递给请求
    },
    "添加角色"
  ); // 调用二次封装的请求方法
};
export const editRole = (data: RoleItem) => {
  return customRequest(
    {
      method: "PUT", // 请求方法
      url: "/system/role", // API 路径
      data, // 将参数传递给请求
    },
    "修改角色"
  ); // 调用二次封装的请求方法
};
export const delRole = (roleId: number) => {
  return customRequest(
    {
      method: "DELETE", // 请求方法
      url: `/system/role/${roleId}`, // API 路径
    },
    `删除角色 ${roleId}`
  ); // 调用二次封装的请求方法
};

export const getRoleMenuTreeselect = (roleId: number) => {
  return customRequest(
    {
      method: "GET", // 请求方法
      url: `/system/menu/roleMenuTreeselect/${roleId}`, // API 路径
    },
    `获取角色菜单 ${roleId}`
  ); // 调用二次封装的请求方法
};
