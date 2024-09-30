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
