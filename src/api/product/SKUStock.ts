import { customRequest } from "../instance";
import { SKUItem } from "@/types/product/product";

/**
 * @fileoverview 库存管理相关的API请求函数
 * @module inventoryAPI
 */

/**
 * 获取指定分店下特定药品的库存信息
 * @async
 * @function getInventoryByStoreId
 * @param {number} storeId - 分店ID
 * @param {number} produceId - 药品ID
 * @returns {Promise<Pick<SKUItem, "id" | "stock">[]>} 返回包含SKU ID和库存数量的数组
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 获取ID为1的分店中ID为100的药品库存
 * const inventory = await getInventoryByStoreId(1, 100);
 */
export const getInventoryByStoreId = (storeId: number, produceId: number) => {
  return customRequest<Pick<SKUItem, "id" | "stock">[]>(
    {
      method: "GET",
      url: `/inventoryManagement/getInventoryByStoreId`,
      params: { storeId, produceId },
    },
    `获取分店ID:${storeId} 的药品ID:${produceId} 的SKU-库存`
  );
};

/**
 * 批量更新指定分店下药品的库存数量
 * @async
 * @function updateInventoryQuantity
 * @param {number} storeId - 店铺ID
 * @param {Pick<SKUItem, "skuCode" | "stock">[]} data - 需要更新的SKU库存信息数组
 * @param {string} data[].skuCode - SKU编码
 * @param {number} data[].stock - 更新后的库存数量
 * @returns {Promise<void>} 更新成功时返回空
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 更新ID为1的分店中多个SKU的库存
 * await updateInventoryQuantity(1, [
 *   { skuCode: "SKU001", stock: 100 },
 *   { skuCode: "SKU002", stock: 50 }
 * ]);
 */
export const updateInventoryQuantity = (
  storeId: number,
  data: Pick<SKUItem, "skuCode" | "stock">[]
) => {
  return customRequest(
    {
      method: "PUT",
      url: `/inventoryManagement/updateInventoryQuantity/${storeId}`,
      data,
    },
    `更新店铺ID:${storeId}的SKU-库存`
  );
};
