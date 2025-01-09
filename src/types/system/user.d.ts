/**
 * @file 用户相关类型定义
 * @description 此文件定义了用户相关的接口类型，包括用户信息、用户表单数据以及获取用户列表的参数类型。
 * @author [您的名字]
 * @date [更新日期]
 */

import { PaginationParams } from "@/types/pagination";

/**
 * 用户信息接口
 * @interface UserItem
 */
export interface UserItem {
  /**
   * 用户ID
   * @type {number | undefined}
   */
  userId?: number;

  /**
   * 是否管理员
   * @type {boolean | undefined}
   */
  admin?: boolean;

  /**
   * 用户头像URL
   * @type {string | undefined}
   */
  avatar?: string;

  /**
   * 创建时间
   * @type {string | undefined}
   */
  createTime?: string;

  /**
   * 更新时间
   * @type {string | undefined}
   */
  updateTime?: string;

  /**
   * 用户名
   * @type {string | undefined}
   */
  userName?: string;

  /**
   * 用户昵称
   * @type {string}
   */
  nickName: string;

  /**
   * 用户邮箱
   * @type {string}
   */
  email: string;

  /**
   * 用户电话号码
   * @type {string | undefined}
   */
  phonenumber?: string;

  /**
   * 用户性别
   * @type {"0" | "1"}
   * @description 性别枚举值：0-男，1-女
   */
  sex: "0" | "1";

  /**
   * 用户角色数组
   * @type {{ roleId: number; roleName: string }[] | undefined}
   */
  roles?: {
    /**
     * 角色ID
     * @type {number}
     */
    roleId: number;

    /**
     * 角色名称
     * @type {string}
     */
    roleName: string;
  }[];

  /**
   * 最后登录IP
   * @type {string | undefined}
   */
  loginIp?: string;

  /**
   * 最后登录时间
   * @type {string | undefined}
   */
  loginDate?: string;

  /**
   * 用户状态
   * @type {"0" | "1" | ""}
   * @description 状态枚举值：0-正常，1-停用，空字符串表示未知状态
   */
  status?: "0" | "1" | "";
}

/**
 * 扩展用户信息接口，用于表单数据
 * @interface UserFormData
 * @extends UserItem
 */
export interface UserFormData extends UserItem {
  /**
   * 用户密码
   * @type {string | undefined}
   */
  password?: string;

  /**
   * 确认密码
   * @type {string | undefined}
   */
  confirmPassword?: string;
}

/**
 * 获取用户列表参数类型
 * @extends PaginationParams
 * @description 继承分页参数，并选择性包含用户的电话号码、用户名和状态字段
 */
export type GetUserListParams = PaginationParams &
  Pick<UserItem, "phonenumber" | "userName" | "status">;
