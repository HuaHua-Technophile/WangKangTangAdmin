// /system/user/list

import { UserItem } from "@/types/system/user";
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
