/**
 * @fileoverview 商品属性相关的API接口
 * @module api/product/attribute
 */

import {
  AttributeItem,
  GetAttributeListParams,
} from "@/types/product/attribute";
import { customRequest } from "../instance";

/**
 * 获取属性列表
 * @async
 * @function getAttributeList
 * @param {string} cid - 分类ID
 * @param {GetAttributeListParams} params - 查询参数对象
 * @returns {Promise<AttributeItem[]>} 返回属性列表数据
 * @throws {Error} 请求失败时抛出错误
 * @example
 * const params = { page: 1, limit: 10 };
 * const attributes = await getAttributeList('123', params);
 */
export const getAttributeList = (
  cid: string,
  params: GetAttributeListParams
) => {
  return customRequest<AttributeItem[]>(
    {
      method: "GET",
      url: `/product/attribute/list/${cid}`,
      params,
    },
    "获取属性列表"
  );
};

/**
 * 添加属性
 * @async
 * @function addAttribute
 * @param {AttributeItem} data - 需要添加的属性数据对象
 * @returns {Promise<void>} 添加成功返回空
 * @throws {Error} 请求失败时抛出错误
 * @example
 * const newAttribute = { name: '颜色', values: ['红', '蓝'] };
 * await addAttribute(newAttribute);
 */
export const addAttribute = (data: AttributeItem) => {
  return customRequest(
    {
      method: "POST",
      url: "/product/attribute/add",
      data,
    },
    "添加属性"
  );
};

/**
 * 修改属性
 * @async
 * @function editAttribute
 * @param {AttributeItem} data - 更新的属性数据对象
 * @param {number} id - 需要修改的属性ID
 * @returns {Promise<void>} 修改成功返回空
 * @throws {Error} 请求失败时抛出错误
 * @example
 * const updateData = { name: '尺寸', values: ['S', 'M', 'L'] };
 * await editAttribute(updateData, 1);
 */
export const editAttribute = (data: AttributeItem, id: number) => {
  return customRequest(
    {
      method: "PUT",
      url: `/product/attribute/edit/${id}`,
      data,
    },
    "修改属性"
  );
};

/**
 * 删除属性
 * @async
 * @function delAttribute
 * @param {number[]} ids - 需要删除的属性ID数组
 * @returns {Promise<void>} 删除成功返回空
 * @throws {Error} 请求失败时抛出错误
 * @example
 * await delAttribute([1, 2, 3]);
 */
export const delAttribute = (ids: number[]) => {
  return customRequest(
    {
      method: "DELETE",
      url: `/product/attribute/${ids}`,
    },
    "删除属性"
  );
};
