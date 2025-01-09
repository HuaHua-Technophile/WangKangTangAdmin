/**
 * @fileoverview 封装与角色管理相关的API请求方法。
 * 包括角色的增删改查、角色授权菜单的查询、角色与用户的关联操作等。
 * 使用了TypeScript类型系统提高代码的类型安全性。
 */

import { customRequest } from "@/api/instance";
import { PaginationParams } from "@/types/pagination";
import { MenuTreeItem } from "@/types/system/menu";
import { GetRoleListParams, RoleItem } from "@/types/system/role";
import { UserItem } from "@/types/system/user";

/**
 * 获取角色列表。
 *
 * @param {GetRoleListParams} params - 查询参数，包含分页信息和筛选条件。
 */
export const getRoleList = (params: GetRoleListParams) => {
  return customRequest<RoleItem[]>(
    {
      method: "GET",
      url: "/system/role/list",
      params,
    },
    "获取角色列表"
  );
};

/**
 * 添加角色信息。
 *
 * @param {RoleItem} data - 角色信息。
 */
export const addRole = (data: RoleItem) => {
  return customRequest(
    {
      method: "POST",
      url: "/system/role",
      data,
    },
    "添加角色"
  );
};

/**
 * 修改角色信息。
 *
 * @param {RoleItem} data - 新的角色信息。
 */
export const editRole = (data: RoleItem) => {
  return customRequest(
    {
      method: "PUT",
      url: "/system/role",
      data,
    },
    "修改角色"
  );
};

/**
 * 删除指定角色。
 *
 * @param {number} roleId - 角色ID。
 */
export const delRole = (roleId: number) => {
  return customRequest(
    {
      method: "DELETE",
      url: `/system/role/${roleId}`,
    },
    `删除角色 ${roleId}`
  );
};

/**
 * 获取指定角色已授权的菜单列表。
 *
 * @param {number} roleId - 角色ID。
 */
export const getRoleMenuTreeselect = (roleId: number) => {
  return customRequest<MenuTreeItem[]>(
    {
      method: "GET",
      url: `/system/menu/roleMenuTreeselect/${roleId}`,
    },
    `获取角色已授权的菜单 ${roleId}`
  );
};

/**
 * @interface AuthUserListParams
 * 表示查询与角色关联用户的参数。
 *
 * @property {number} roleId - 角色ID。
 */
interface AuthUserListParams extends PaginationParams {
  roleId: number;
}

/**
 * 查询未分配该角色的用户列表。
 *
 * @param {AuthUserListParams} params - 查询参数，包含分页信息和角色ID。
 */
export const getAuthUserUnallocatedList = (params: AuthUserListParams) => {
  return customRequest<UserItem[]>(
    {
      method: "GET",
      url: `/system/role/authUser/unallocatedList`,
      params,
    },
    `查询未分配该角色的用户列表`
  );
};

/**
 * 查询已分配该角色的用户列表。
 *
 * @param {AuthUserListParams} params - 查询参数，包含分页信息和角色ID。
 */
export const getAuthUserAllocatedList = (params: AuthUserListParams) => {
  return customRequest<UserItem[]>(
    {
      method: "GET",
      url: `/system/role/authUser/allocatedList`,
      params,
    },
    `查询已分配该角色的用户列表`
  );
};

/**
 * @interface AuthUserCancelOrSelect
 * 表示取消或分配角色与用户关系的参数。
 *
 * @property {number} roleId - 角色ID。
 * @property {number[]} userIds - 用户ID数组。
 */
interface AuthUserCancelOrSelect {
  roleId: number;
  userIds: number[];
}

/**
 * 取消角色对用户的授权。
 *
 * @param {AuthUserCancelOrSelect} params - 包含角色ID和用户ID数组的参数。
 */
export const authUserCancel = (params: AuthUserCancelOrSelect) => {
  return customRequest<UserItem[]>(
    {
      method: "PUT",
      url: `/system/role/authUser/cancelAll`,
      params,
    },
    `取消角色对于用户的授权`
  );
};

/**
 * 将角色授权给用户。
 *
 * @param {AuthUserCancelOrSelect} params - 包含角色ID和用户ID数组的参数。
 */
export const authUserSelect = (params: AuthUserCancelOrSelect) => {
  return customRequest<UserItem[]>(
    {
      method: "PUT",
      url: `/system/role/authUser/selectAll`,
      params,
    },
    `将角色授权用户`
  );
};
