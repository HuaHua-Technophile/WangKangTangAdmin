// /system/user/list

import { GetUserListParams, UserFormData, UserItem } from "@/types/system/user";
import { customRequest } from "../instance";

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

export const delUser = (userIds: number[]) => {
  return customRequest(
    {
      method: "DELETE", // 请求方法
      url: `/system/user/${userIds}`, // API 路径
    },
    `删除用户 ${userIds}`
  ); // 调用二次封装的请求方法
};

// 重置密码 /system/user/resetPwd
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
