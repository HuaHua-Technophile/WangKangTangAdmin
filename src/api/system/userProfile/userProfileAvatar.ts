// src/api/system/userProfile/userProfileAvatar.ts

import { customRequest } from "@/api/instance";

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
