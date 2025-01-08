import { customRequest } from "../instance";

/**
 * 获取该分店下药品的库存
 * @param storeId 分店ID
 */
export const getInventoryByStoreId = (storeId: number) => {
  return customRequest<{ id: number; stock: number }[]>(
    {
      method: "GET",
      url: `/inventoryManagement/getInventoryByStoreId`,
      params: { storeId },
    },
    "获取分店库存"
  );
};

/**
 * 添加单个SKU对应的商品库存
 * @param storeId 店铺ID
 * @param skuCode 商品SKU编码
 * @param stock 库存数量
 */
export const updateInventoryQuantity = (
  storeId: number,
  skuCode: string,
  stock: number
) => {
  return customRequest(
    {
      method: "PUT",
      url: "/inventoryManagement/updateInventoryQuantity",
      data: { storeId, skuCode, stock },
    },
    "更新单个SKU库存"
  );
};

/**
 * 添加商品ID对应的所有SKU库存
 * @param storeId 店铺ID
 * @param productId 商品ID
 * @param stock 库存数量
 */
export const updateInventoryQuantityByProductId = (
  storeId: number,
  productId: number,
  stock: number
) => {
  return customRequest(
    {
      method: "PUT",
      url: "/inventoryManagement/updateInventoryQuantityByProductId",
      data: { storeId, productId, stock },
    },
    "更新商品ID对应的所有SKU库存"
  );
};
