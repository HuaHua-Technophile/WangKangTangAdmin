import { GetProductListParams, ProductItem } from "@/types/product/product";
import { customRequest } from "../instance";

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
      method: "POST",
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
 * 获取药品编辑信息
 * @param id 药品ID
 */
export const getProductInfo = (id: number) => {
  return customRequest<
    ProductItem & { productAttributeCategoryList: { id: number }[] }
  >(
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

/**
 * 批量删除药品
 * @param ids id数组
 */
export const delProduct = (ids: number[]) => {
  return customRequest(
    {
      method: "POST",
      url: "/product/update/deleteStatus",
      params: {
        ids,
        delFlag: 1,
      },
    },
    `删除了${ids}这些药品`
  );
};
/**
 * 批量上架/下架药品
 * @param params 上架下架参数
 */
export const toggleProductActivation = (params: {
  ids: number[];
  isActive: 0 | 1;
}) => {
  return customRequest(
    {
      method: "POST",
      url: "/product/update/isActive",
      params,
    },
    "修改上架/下架"
  );
};

/**
 * 批量修改推荐状态
 * @param params 状态修改参数
 */
export const updateRecommendStatus = (params: {
  ids: number[];
  recommendStatus: 0 | 1;
}) => {
  return customRequest(
    {
      method: "POST",
      url: "/product/update/recommendStatus",
      params,
    },
    "修改推荐状态"
  );
};
