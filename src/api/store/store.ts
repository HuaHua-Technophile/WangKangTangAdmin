/**
 * @fileoverview 店铺管理相关的API请求函数
 * @description 封装了店铺管理模块的所有后端接口调用，包括增删改查等基础操作
 * @author [您的名字] <您的邮箱>
 * @copyright 2024
 * @version 1.0.0
 */

import { StoreItem } from "@/types/store/store";
import { customRequest } from "../instance";

/**
 * 新增店铺
 * @async
 * @function addStore
 * @description 创建新的店铺信息
 * @param {StoreItem} data - 店铺数据对象
 * @throws {Error} 当请求失败时抛出错误
 * @example
 * ```typescript
 * const newStore: StoreItem = {
 *   storeName: "示例店铺",
 *   address: "示例地址"
 * };
 * try {
 *   await addStore(newStore);
 * } catch (error) {
 *   console.error('添加店铺失败:', error);
 * }
 * ```
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
 * @async
 * @function delStore
 * @description 根据店铺ID删除指定店铺
 * @param {number} id - 要删除的店铺ID
 * @throws {Error} 当请求失败时抛出错误
 * @example
 * ```typescript
 * try {
 *   await delStore(1);
 * } catch (error) {
 *   console.error('删除店铺失败:', error);
 * }
 * ```
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
 * @async
 * @function getStoreList
 * @description 获取店铺列表，支持条件查询
 * @param {StoreItem} [params] - 可选的查询参数对象
 * @throws {Error} 当请求失败时抛出错误
 * @example
 * ```typescript
 * // 查询所有店铺
 * const allStores = await getStoreList();
 *
 * // 条件查询
 * const queryParams: StoreItem = { status: 1 };
 * const activeStores = await getStoreList(queryParams);
 * ```
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
 * @async
 * @function editStore
 * @description 更新指定店铺的信息
 * @param {StoreItem} data - 需要更新的店铺数据，必须包含店铺ID
 * @throws {Error} 当请求失败时抛出错误
 * @example
 * ```typescript
 * const updateData: StoreItem = {
 *   id: 1,
 *   storeName: "更新后的店铺名称",
 *   status: 1
 * };
 * try {
 *   await editStore(updateData);
 * } catch (error) {
 *   console.error('更新店铺失败:', error);
 * }
 * ```
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
