// api/product/attributeCategory.ts
import { customRequest } from "@/api/instance";
import { AttributeItem } from "@/types/product/attribute";
import {
  AttributeCategoryItem,
  AttributeCategoryParams,
} from "@/types/product/attributeCategory";

/**
 * 新增药品属性分类
 * @param {AttributeCategoryItem} params - 药品属性分类信息
 * @returns {Promise<any>} 返回创建结果
 */
export const addAttributeCategory = (params: AttributeCategoryItem) => {
  return customRequest(
    {
      method: "POST",
      url: "/product/attribute/category/add",
      params,
    },
    "新增药品属性分类"
  );
};

/**
 * 修改药品属性分类
 * @param {AttributeCategoryItem} params - 需要更新的药品属性分类信息
 * @returns {Promise<any>} 返回更新结果
 */
export const editAttributeCategory = (params: AttributeCategoryItem) => {
  return customRequest(
    {
      method: "PUT",
      url: `/product/attribute/category/edit/${params.id}`,
      params,
    },
    "修改药品属性分类"
  );
};

/**
 * 分页获取所有药品属性分类
 * @param {AttributeCategoryParams} params - 分页查询参数
 * @returns {Promise<AttributeCategoryItem[]>} 返回药品属性分类列表
 */
export const getAttributeCategoryList = (params: AttributeCategoryParams) => {
  return customRequest<AttributeCategoryItem[]>(
    {
      method: "GET",
      url: "/product/attribute/category/list",
      params,
    },
    "获取药品属性分类列表"
  );
};

/**
 * 获取所有药品属性分类及其下属性
 * @returns {Promise<AttributeCategoryItem[]>} 返回包含下属性的药品属性分类列表
 */
export const getAttributeCategoryWithAttr = () => {
  return customRequest<AttributeCategoryItem[]>(
    {
      method: "GET",
      url: "/product/attribute/category/list/withAttr",
    },
    "获取所有药品属性分类及其下属性"
  );
};

/**
 * 删除药品属性分类
 * @param {number[]} ids - 要删除的药品属性分类ID数组
 * @returns {Promise<any>} 返回删除结果
 */
export const delAttributeCategories = (ids: number[]) => {
  return customRequest(
    {
      method: "DELETE",
      url: `/product/attribute/category/${ids}`,
    },
    "删除药品属性分类"
  );
};

/**
 * 获取单个属性分类详情
 * @param {number} id - 属性分类ID
 * @returns {Promise<AttributeItem[]>} 返回属性分类详细信息
 * @description 根据ID获取单个属性分类的详细信息
 */
export const getAttributeCategoryDetail = (id: number) => {
  return customRequest<AttributeItem[]>(
    {
      method: "GET",
      url: `/product/attribute/${id}`,
    },
    `获取ID:${id}属性分类详情`
  );
};
