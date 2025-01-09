/**
 * @fileoverview 定义与角色管理相关的接口和类型。
 * 该文件包含角色项的接口定义，以及获取角色列表参数类型的定义。
 * 使用了TypeScript类型系统提高代码的类型安全性。
 */

import { PaginationParams } from "@/types/pagination";

/**
 * @interface RoleItem
 * 表示角色的基本结构。
 */
export interface RoleItem {
  /**
   * 角色标识符
   * @type {string | undefined}
   */
  roleKey?: string;

  /**
   * 角色名称
   * @type {string | undefined}
   */
  roleName?: string;

  /**
   * 角色状态
   * @type {string | undefined}
   */
  status?: string;

  /**
   * 角色ID
   * @type {number | undefined}
   */
  roleId?: number;

  /**
   * 角色排序
   * @type {number | undefined}
   */
  roleSort?: number;

  /**
   * 是否为管理员
   * @type {boolean | undefined}
   */
  admin?: boolean;

  /**
   * 关联的菜单ID列表
   * @type {number[] | undefined}
   */
  menuIds?: number[];

  /**
   * 数据范围
   * 1：全部数据权限
   * 2：自定数据权限
   * 3：本部门数据权限
   * 4：本部门及以下数据权限
   * @type {"1" | "2" | "3" | "4" | undefined}
   */
  // dataScope?: "1" | "2" | "3" | "4";
}

/**
 * 表示获取角色列表的参数结构。
 * 继承了分页参数，并包含角色名称、角色标识符和状态字段。
 */
export type GetRoleListParams = PaginationParams &
  Pick<RoleItem, "roleName" | "roleKey" | "status">;
