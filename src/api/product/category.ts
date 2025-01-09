/**
 * @fileoverview 药品分类相关的 API 请求模块
 * @module api/product/category
 */

/**
 * 导入自定义请求实例
 * @import customRequest - 封装的请求方法
 */
import { customRequest } from "@/api/instance";
/**
 * 导入分类相关的类型定义
 * @import CategoryItem - 分类项目类型
 * @import CategoryParams - 分类查询参数类型
 */
import { CategoryItem, CategoryParams } from "@/types/product/category";

/**
 * 新增药品分类
 * @async
 * @function addCategory
 * @param {Omit<CategoryItem, "id">} data - 新增分类的数据，不包含 id 字段
 * @throws {Error} 请求失败时抛出错误
 */
export const addCategory = (data: Omit<CategoryItem, "id">) => {
  return customRequest(
    {
      method: "POST",
      url: "/product/category/add",
      data,
    },
    "新增药品分类"
  );
};

/**
 * 修改药品分类
 * @async
 * @function editCategory
 * @param {CategoryItem} data - 完整的分类数据，包含 id
 * @throws {Error} 请求失败时抛出错误
 */
export const editCategory = (data: CategoryItem) => {
  return customRequest(
    {
      method: "PUT",
      url: "/product/category/edit",
      data,
    },
    "修改药品分类"
  );
};

/**
 * 查询药品分类列表
 * @async
 * @function getCategoryList
 * @param {CategoryParams} params - 查询参数
 * @throws {Error} 请求失败时抛出错误
 */
export const getCategoryList = (params: CategoryParams) => {
  return customRequest<CategoryItem[]>(
    {
      method: "GET",
      url: "/product/category/list",
      params,
    },
    "获取药品分类列表"
  );
};

/**
 * 查询分类列表（排除指定节点）
 * @async
 * @function getCategoryListExclude
 * @param {number} categoryId - 需要排除的分类 ID
 * @throws {Error} 请求失败时抛出错误
 */
export const getCategoryListExclude = (categoryId: number) => {
  return customRequest<CategoryItem[]>(
    {
      method: "GET",
      url: `/product/category/list/exclude/${categoryId}`,
    },
    `获取药品分类列表(排除节点 ${categoryId})`
  );
};

/**
 * 批量删除药品分类
 * @async
 * @function delCategories
 * @param {number[]} ids - 要删除的分类 ID 数组
 * @throws {Error} 请求失败时抛出错误
 */
export const delCategories = (ids: number[]) => {
  return customRequest(
    {
      method: "DELETE",
      url: `/product/category/${ids}`,
    },
    "删除药品分类"
  );
};
