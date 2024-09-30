// src/api/system/userProfile/updatePwd.ts

import { customRequest } from "@/api/instance";

export const updatePwd = (data: {
  oldPassword: string;
  newPassword: string;
}) => {
  return customRequest(
    {
      url: "/system/user/profile/updatePwd",
      method: "PUT",
      data,
    },
    "修改密码"
  );
};
