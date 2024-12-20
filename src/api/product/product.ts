import {
  GetProductListParams,
  ProductItem,
  UpdateStatusParams,
} from "@/types/product/product";
import { customRequest } from "../instance";
import { AttributeCategoryItem } from "@/types/product/attributeCategory";

/**
 * 添加药品
 * @param data 药品数据
 */
export const addProduct = (data: ProductItem & { delFlag: 0 }) => {
  return customRequest(
    {
      method: "POST",
      url: "/product/add",
      data,
    },
    "添加药品"
  );
};

/**
 * 更新药品信息
 * @param id 药品ID
 * @param data 药品数据
 */
export const editProduct = (id: number, data: ProductItem) => {
  return customRequest(
    {
      method: "PUT",
      url: `/product/update/${id}`,
      data,
    },
    "修改药品"
  );
};

/**
 * 分页查询药品列表
 * @param params 查询参数
 */
export const getProductList = (params: GetProductListParams) => {
  return customRequest<ProductItem[]>(
    {
      method: "GET",
      url: "/product/list",
      params,
    },
    "获取药品列表"
  );
};

/**
 * 批量修改删除状态
 * @param data 状态修改参数
 */
export const updateDeleteStatus = (data: UpdateStatusParams) => {
  return customRequest(
    {
      method: "POST",
      url: "/product/update/deleteStatus",
      data,
    },
    "修改删除状态"
  );
};

/**
 * 批量修改推荐状态
 * @param data 状态修改参数
 */
export const updateRecommendStatus = (data: UpdateStatusParams) => {
  return customRequest(
    {
      method: "POST",
      url: "/product/update/recommendStatus",
      data,
    },
    "修改推荐状态"
  );
};

/**
 * 获取药品编辑信息
 * @param id 药品ID
 */
export const getProductInfo = (id: number) => {
  return customRequest<ProductItem>(
    {
      method: "GET",
      url: `/product/updateInfo/${id}`,
    },
    "获取药品编辑信息"
  );
};

/**
 * 根据药品名称模糊查询
 * @param productName 药品名称
 */
export const searchProduct = (productName: string) => {
  return customRequest<ProductItem[]>(
    {
      method: "GET",
      url: `/product/${productName}`,
    },
    "搜索药品"
  );
};

// 6. 查询药品选择了哪个属性分类
export const getAttributeCategoryByProduct = (id: number) => {
  return customRequest<AttributeCategoryItem>(
    {
      method: "GET",
      url: `/product/attribute/category/${id}`,
    },
    `查询ID:${id}药品选择了哪个属性分类`
  );
};
