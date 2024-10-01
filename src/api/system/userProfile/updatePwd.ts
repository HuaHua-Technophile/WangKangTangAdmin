// src/api/system/userProfile/updatePwd.ts

import { customRequest } from "@/api/instance";

export const updatePwd = (params: {
  oldPassword: string;
  newPassword: string;
}) => {
  return customRequest(
    {
      url: "/system/user/profile/updatePwd",
      method: "PUT",
      params,
    },
    "修改密码"
  );
};
