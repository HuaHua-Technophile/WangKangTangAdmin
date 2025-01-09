/**
 * @file 用户个人信息相关API接口
 * @description 提供与用户个人信息相关的API请求方法，包括获取个人信息、修改个人信息、上传头像以及修改密码等功能。
 * @module api/system/userProfile
 * @requires @/api/instance
 * @requires @/types/system/user
 * @date [更新日期]
 */

import { customRequest } from "@/api/instance";
import { UserItem } from "@/types/system/user";

/**
 * 获取用户个人信息
 * @function getUserProfile
 * @example
 * getUserProfile().then((res) => {
 *   console.log("用户个人信息：", res);
 * });
 */
export const getUserProfile = () => {
  return customRequest<UserItem>(
    {
      url: "/system/user/profile",
      method: "GET",
    },
    "获取详细个人信息"
  );
};

/**
 * 修改用户个人信息
 * @function editUserProfile
 * @param {UserItem} data - 用户信息数据
 * @example
 * editUserProfile({ userName: "张三", nickName: "管理员" }).then((res) => {
 *   console.log("修改结果：", res);
 * });
 */
export const editUserProfile = (data: UserItem) => {
  return customRequest(
    {
      url: "/system/user/profile",
      method: "PUT",
      data,
    },
    "修改个人信息"
  );
};

/**
 * 上传用户头像
 * @function userProfileAvatar
 * @param {File} file - 用户上传的头像文件
 * @example
 * const file = new File(["content"], "avatar.png", { type: "image/png" });
 * userProfileAvatar(file).then((res) => {
 *   console.log("头像上传结果：", res);
 * });
 */
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

/**
 * 修改用户密码
 * @function updatePwd
 * @param {Object} params - 包含旧密码和新密码的对象
 * @param {string} params.oldPassword - 用户的旧密码
 * @param {string} params.newPassword - 用户的新密码
 * @example
 * updatePwd({ oldPassword: "123456", newPassword: "newPassword123" }).then((res) => {
 *   console.log("密码修改结果：", res);
 * });
 */
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
