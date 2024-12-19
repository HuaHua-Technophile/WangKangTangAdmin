// api/product/attributeCategory.ts
import { customRequest } from "@/api/instance";
import { AttributeItem } from "@/types/product/attribute";
import {
  AttributeCategoryItem,
  AttributeCategoryParams,
} from "@/types/product/attributeCategory";

// 1. 新增药品属性分类
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

// 2. 修改药品属性分类
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

// 3. 分页获取所有药品属性分类
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

// 4. 获取所有药品属性分类及其下属性
export const getAttributeCategoryWithAttr = () => {
  return customRequest<AttributeCategoryItem[]>(
    {
      method: "GET",
      url: "/product/attribute/category/list/withAttr",
    },
    "获取所有药品属性分类及其下属性"
  );
};

// 5. 删除药品属性分类
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
 * @param id 属性ID
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
