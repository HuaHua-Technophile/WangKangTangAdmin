import { customRequest } from "@/api/instance";
import { PaginationParams } from "@/types/pagination";
import { MenuTreeItem } from "@/types/system/menu";
import { GetRoleListParams, RoleItem } from "@/types/system/role";
import { UserItem } from "@/types/system/user";
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

//获取对应角色已经授权的菜单有哪些
export const getRoleMenuTreeselect = (roleId: number) => {
  return customRequest<MenuTreeItem[]>(
    {
      method: "GET", // 请求方法
      url: `/system/menu/roleMenuTreeselect/${roleId}`, // API 路径
    },
    `获取角色已授权的菜单 ${roleId}`
  ); // 调用二次封装的请求方法
};
interface AuthUserListParams extends PaginationParams {
  roleId: number;
}
export const getAuthUserUnallocatedList = (params: AuthUserListParams) => {
  return customRequest<UserItem[]>(
    {
      method: "GET", // 请求方法
      url: `/system/role/authUser/unallocatedList`, // API 路径
      params,
    },
    `查询未分配该角色的用户列表`
  ); // 调用二次封装的请求方法
};

export const getAuthUserAllocatedList = (params: AuthUserListParams) => {
  return customRequest<UserItem[]>(
    {
      method: "GET", // 请求方法
      url: `/system/role/authUser/allocatedList`, // API 路径
      params,
    },
    `查询已分配该角色的用户列表`
  ); // 调用二次封装的请求方法
};
interface AuthUserCancelOrSelect {
  roleId: number;
  userIds: number[];
}
export const authUserCancel = (params: AuthUserCancelOrSelect) => {
  return customRequest<UserItem[]>(
    {
      method: "PUT", // 请求方法
      url: `/system/role/authUser/cancelAll`, // API 路径
      params,
    },
    `取消角色对于用户的授权`
  ); // 调用二次封装的请求方法
};
export const authUserSelect = (params: AuthUserCancelOrSelect) => {
  return customRequest<UserItem[]>(
    {
      method: "PUT", // 请求方法
      url: `/system/role/authUser/selectAll`, // API 路径
      params,
    },
    `将角色授权用户`
  ); // 调用二次封装的请求方法
};
