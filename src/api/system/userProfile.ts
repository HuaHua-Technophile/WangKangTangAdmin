// src/api/system/userProfile.ts

import { customRequest } from "@/api/instance";
import { UserProFile } from "@/types/userProfile";

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

export const userProfileAvatar = (file: File) => {
  const formData = new FormData();
  formData.append("avatarfile", file);

  return customRequest<{ imgUrl: string }>(
    {
      url: "/system/user/profile/avatar",
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
    "上传头像"
  );
};

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