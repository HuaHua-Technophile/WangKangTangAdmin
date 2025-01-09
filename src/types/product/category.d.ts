/**
 * @fileoverview 商品分类相关的类型定义
 * @module @/types/product/category
 * @description 定义了商品分类的数据结构和查询参数类型
 */

import { PaginationParams } from "@/types/pagination";

/**
 * 商品分类项接口
 * @interface CategoryItem
 * @description 描述商品分类的数据结构，包含分类的基本信息和层级关系
 */
export interface CategoryItem {
  /**
   * 分类ID
   * @type {number}
   */
  id?: number;

  /**
   * 分类名称
   * @type {string}
   */
  name?: string;

  /**
   * 父分类ID
   * @type {number}
   * @description 用于构建分类层级关系，顶级分类的parentId为0或null
   */
  parentId?: number;

  /**
   * 分类图标
   * @type {string}
   * @description 分类的展示图标，通常为URL地址
   */
  icon?: string;

  /**
   * 分类缩略图
   * @type {string}
   * @description 分类的缩略图，通常为URL地址
   */
  miniImg?: string;

  /**
   * 排序值
   * @type {number}
   * @description 用于控制分类的显示顺序，数值越小越靠前
   */
  sort: number;

  /**
   * 分类状态
   * @type {number}
   * @description 0表示禁用，1表示启用
   */
  status?: number;

  /**
   * 子分类列表
   * @type {CategoryItem[]}
   * @description 当前分类的直接子分类列表
   */
  children?: CategoryItem[];
}

/**
 * 分类查询参数类型
 * @type CategoryParams
 * @description 继承分页参数，并包含分类查询的特定参数
 * @extends {PaginationParams}
 */
export type CategoryParams = PaginationParams &
  Pick<CategoryItem, "name" | "status">;
