/**
 * @fileoverview 定义药品属性分类相关的接口和类型
 */

import { PaginationParams } from "@/types/pagination";

/**
 * 药品属性分类项接口
 * @interface AttributeCategoryItem
 * @description 描述单个药品属性分类的数据结构
 */
export interface AttributeCategoryItem {
  /**
   * 属性分类ID
   * @type {number}
   * @optional
   */
  id?: number;

  /**
   * 属性分类名称
   * @type {string}
   */
  name: string;

  /**
   * 该分类下的属性数量
   * @type {number}
   * @optional
   */
  attributeCount?: number;

  /**
   * 该分类下的参数数量
   * @type {number}
   * @optional
   */
  paramCount?: number;
}

/**
 * 药品属性分类查询参数类型
 * @typedef {Object} AttributeCategoryParams
 * @description 继承分页参数并包含属性分类名称的查询参数类型
 * @extends {PaginationParams}
 */
export type AttributeCategoryParams = PaginationParams &
  Pick<AttributeCategoryItem, "name">;
