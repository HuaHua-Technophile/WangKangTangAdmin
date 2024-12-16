import {
  GetProductListParams,
  ProductItem,
  UpdateStatusParams,
} from "@/types/product/product";
import { customRequest } from "../instance";

/**
 * 添加药品
 * @param data 药品数据
 */
export const addProduct = (data: ProductItem) => {
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
 * 更新药品信息
 * @param id 药品ID
 * @param data 药品数据
 */
export const updateProduct = (id: number, data: ProductItem) => {
  return customRequest(
    {
      method: "PUT",
      url: `/product/update/${id}`,
      data,
    },
    "更新药品信息"
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
