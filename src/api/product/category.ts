import { customRequest } from "@/api/instance";
import { CategoryItem, CategoryParams } from "@/types/product/category";

// 1. 新增药品分类
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

// 2. 修改药品分类
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

// 3. 查询药品分类列表
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

// 4. 查询分类列表（排除节点）
export const getCategoryListExclude = (categoryId: number) => {
  return customRequest<CategoryItem[]>(
    {
      method: "GET",
      url: `/product/category/list/exclude/${categoryId}`,
    },
    `获取药品分类列表(排除节点 ${categoryId})`
  );
};

// 5. 删除药品分类
export const delCategories = (ids: number[]) => {
  return customRequest(
    {
      method: "DELETE",
      url: `/product/category/${ids}`,
    },
    "删除药品分类"
  );
};
