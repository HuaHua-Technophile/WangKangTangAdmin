// src/api/system/userProfile/userProfile.ts

import { customRequest } from "@/api/instance";
import { UserProFile } from "@/types/system/userProfile/userProfile";

export const getUserProfile = () => {
  return customRequest<UserProFile>(
    {
      url: "/system/user/profile",
      method: "GET",
    },
    "获取个人信息"
  );
};

export const editUserProfile = (data: UserProFile) => {
  return customRequest(
    {
      url: "/system/user/profile",
      method: "PUT",
      data,
    },
    "修改个人信息"
  );
};
