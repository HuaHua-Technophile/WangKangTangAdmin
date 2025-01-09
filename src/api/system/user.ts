/**
 * @file 用户管理相关API接口
 * @description 提供与用户相关的API请求方法，包括获取用户列表、添加用户、编辑用户、删除用户以及重置用户密码等功能。
 * @module api/system/user
 * @author [您的名字]
 * @date [更新日期]
 */

import { GetUserListParams, UserFormData, UserItem } from "@/types/system/user";
import { customRequest } from "../instance";

/**
 * 获取用户列表
 * @function getUserList
 * @param {GetUserListParams} params - 查询参数，包括分页信息和筛选条件
 * @example
 * getUserList({ page: 1, pageSize: 10, userName: "张三" }).then((res) => {
 *   console.log(res);
 * });
 */
export const getUserList = (params: GetUserListParams) => {
  return customRequest<UserItem[]>(
    {
      method: "get", // 请求方法
      url: "/system/user/list", // API 路径
      params, // 将参数传递给请求
    },
    "获取用户列表"
  ); // 调用二次封装的请求方法
};

/**
 * 添加用户
 * @function addUser
 * @param {UserFormData} data - 用户表单数据，包括用户名、密码、角色等信息
 * @example
 * addUser({ userName: "张三", password: "123456", roles: [{ roleId: 1, roleName: "管理员" }] }).then((res) => {
 *   console.log(res);
 * });
 */
export const addUser = (data: UserFormData) => {
  return customRequest(
    {
      method: "POST",
      url: "/system/user",
      data,
    },
    "添加用户"
  );
};

/**
 * 编辑用户
 * @function editUser
 * @param {UserFormData} data - 用户表单数据，包括用户ID、角色等需要更新的信息
 * @example
 * editUser({ userId: 1, userName: "李四", roles: [{ roleId: 2, roleName: "普通用户" }] }).then((res) => {
 *   console.log(res);
 * });
 */
export const editUser = (data: UserFormData) => {
  return customRequest(
    {
      method: "PUT",
      url: "/system/user",
      data,
    },
    "修改用户"
  );
};

/**
 * 删除用户
 * @function delUser
 * @param {number[]} userIds - 用户ID数组
 * @example
 * delUser([1, 2, 3]).then((res) => {
 *   console.log(res);
 * });
 */
export const delUser = (userIds: number[]) => {
  return customRequest(
    {
      method: "DELETE", // 请求方法
      url: `/system/user/${userIds}`, // API 路径
    },
    `删除用户 ${userIds}`
  ); // 调用二次封装的请求方法
};

/**
 * 重置用户密码
 * @function userResetPwd
 * @param {number} userId - 用户ID
 * @param {string} password - 新密码
 * @example
 * userResetPwd(1, "newPassword123").then((res) => {
 *   console.log(res);
 * });
 */
export const userResetPwd = (userId: number, password: string) => {
  return customRequest(
    {
      method: "PUT", // 请求方法
      url: `/system/user/resetPwd`, // API 路径
      data: {
        userId,
        password,
      },
    },
    `重置用户密码`
  ); // 调用二次封装的请求方法
};
