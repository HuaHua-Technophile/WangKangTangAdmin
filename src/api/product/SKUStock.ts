import { customRequest } from "../instance";
import { SKUItem } from "@/types/product/product";
/**
 * 获取该分店下,该药品的库存
 * @param storeId 分店ID
 * @param produceId 药品ID
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
 * 更新该分店下药品的库存
 * @param storeId 店铺ID
 * @param data SKU-库存 列表
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
