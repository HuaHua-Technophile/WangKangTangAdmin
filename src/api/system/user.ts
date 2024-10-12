// /system/user/list

import { UserFormData, UserItem } from "@/types/system/user";
import { customRequest } from "../instance";
import { PaginationParams } from "@/types/pagination";

export interface UserQueryParams {
  userName?: string;
  phonenumber?: string;
  status?: "" | "0" | "1";
}

type GetUserListParams = PaginationParams & UserQueryParams;

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
