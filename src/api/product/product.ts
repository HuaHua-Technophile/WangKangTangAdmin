import { GetProductListParams, ProductItem } from "@/types/product/product";
import { customRequest } from "../instance";

/**
 * 添加新药品到系统
 * @param {ProductItem} data - 要添加的药品完整数据
 * @returns {Promise<any>} - 返回添加操作的处理结果
 * @throws {Error} 当添加操作失败时抛出错误
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
 * 更新已存在药品的信息
 * @param {number} id - 要更新的药品唯一标识符
 * @param {ProductItem} data - 更新后的药品数据
 * @returns {Promise<any>} - 返回更新操作的处理结果
 * @throws {Error} 当更新操作失败时抛出错误
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
 * 分页查询药品列表，支持多种筛选条件
 * @param {GetProductListParams} params - 查询参数对象，包含分页信息和筛选条件
 * @returns {Promise<ProductItem[]>} - 返回符合条件的药品列表
 * @throws {Error} 当查询操作失败时抛出错误
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
 * 获取指定药品的详细编辑信息
 * @param {number} id - 要查询的药品ID
 * @returns {Promise<ProductItem & { productAttributeCategoryList: { id: number }[] }>} - 返回药品详细信息，包含属性分类列表
 * @throws {Error} 当查询操作失败时抛出错误
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
 * 根据药品名称进行模糊查询
 * @param {string} productName - 要搜索的药品名称关键词
 * @returns {Promise<ProductItem[]>} - 返回匹配的药品列表
 * @throws {Error} 当搜索操作失败时抛出错误
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
 * 批量删除指定的药品
 * @param {number[]} ids - 要删除的药品ID数组
 * @returns {Promise<any>} - 返回删除操作的处理结果
 * @throws {Error} 当删除操作失败时抛出错误
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
 * 批量修改药品的上架/下架状态
 * @param {Object} params - 状态修改参数
 * @param {number[]} params.ids - 要修改状态的药品ID数组
 * @param {0 | 1} params.isActive - 目标状态：0表示下架，1表示上架
 * @returns {Promise<any>} - 返回状态修改操作的处理结果
 * @throws {Error} 当状态修改操作失败时抛出错误
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
 * 批量修改药品的推荐状态
 * @param {Object} params - 推荐状态修改参数
 * @param {number[]} params.ids - 要修改推荐状态的药品ID数组
 * @param {0 | 1} params.recommendStatus - 目标推荐状态：0表示不推荐，1表示推荐
 * @returns {Promise<any>} - 返回推荐状态修改操作的处理结果
 * @throws {Error} 当推荐状态修改操作失败时抛出错误
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
