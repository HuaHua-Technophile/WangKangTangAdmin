import { StoreItem } from "@/types/store/store";
import { customRequest } from "../instance";

/**
 * 新增店铺
 * @param data 店铺数据
 */
export const addStore = (data: StoreItem) => {
  return customRequest(
    {
      method: "POST",
      url: "/storeManagement/add",
      data,
    },
    "新增店铺"
  );
};

/**
 * 删除店铺
 * @param id 店铺ID
 */
export const delStore = (id: number) => {
  return customRequest(
    {
      method: "DELETE",
      url: `/storeManagement/delete/${id}`,
    },
    "删除店铺"
  );
};

/**
 * 查询店铺列表
 * @param params 查询参数
 */
export const getStoreList = (params?: StoreItem) => {
  return customRequest<StoreItem[]>(
    {
      method: "GET",
      url: "/storeManagement/list",
      params,
    },
    "查询店铺列表"
  );
};

/**
 * 更新店铺信息
 * @param data 店铺数据
 */
export const editStore = (data: StoreItem) => {
  return customRequest(
    {
      method: "PUT",
      url: "/storeManagement/update",
      data,
    },
    "更新店铺信息"
  );
};
