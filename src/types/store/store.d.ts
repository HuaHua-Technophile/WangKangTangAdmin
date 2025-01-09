/**
 * @fileoverview 店铺信息相关的类型定义
 * @description 定义了店铺基本信息的数据结构，包括店铺名称、地址、营业时间等核心信息
 * @author [您的名字] <您的邮箱>
 * @copyright 2024
 * @version 1.0.0
 */

/**
 * 店铺信息接口
 * @interface StoreItem
 * @description 描述单个店铺的基本信息结构
 * @since 1.0.0
 * @example
 * ```typescript
 * const store: StoreItem = {
 *   id: 1,
 *   storeName: "示例店铺",
 *   address: "示例地址",
 *   businessHours: ["09:00-18:00"],
 *   phone: "123-456-7890",
 *   status: 1
 * };
 * ```
 */
export interface StoreItem {
  /**
   * 店铺唯一标识符
   * @type {number}
   * @optional
   */
  id?: number;

  /**
   * 店铺名称
   * @type {string}
   * @optional
   */
  storeName?: string;

  /**
   * 店铺地址
   * @type {string}
   * @optional
   */
  address?: string;

  /**
   * 营业时间
   * @type {string | string[]}
   * @optional
   * @description 可以是单个时间段字符串或者多个时间段的数组
   * @example "09:00-18:00" 或 ["09:00-12:00", "14:00-18:00"]
   */
  businessHours?: string | string[];

  /**
   * 联系电话
   * @type {string}
   * @optional
   */
  phone?: string;

  /**
   * 店铺状态
   * @type {0 | 1}
   * @optional
   * @description 0表示禁用状态，1表示启用状态
   */
  status?: 0 | 1;
}
