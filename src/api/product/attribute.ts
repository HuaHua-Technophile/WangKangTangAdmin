// src/api/product/attribute.ts

import {
  AttributeItem,
  GetAttributeListParams,
} from "@/types/product/attribute";
import { customRequest } from "../instance";

/**
 * 获取属性列表
 * @param cid 分类ID
 * @param params 查询参数
 */
export const getAttributeList = (
  cid: number,
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
 * @param data 属性数据
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
 * @param id 属性ID
 * @param data 属性数据
 */
export const editAttribute = (id: number, data: AttributeItem) => {
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
 * @param ids 属性ID数组
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

/**
 * 获取单个属性详情
 * @param id 属性ID
 */
export const getAttributeDetail = (id: number) => {
  return customRequest<AttributeItem>(
    {
      method: "GET",
      url: `/product/attribute/${id}`,
    },
    "获取属性详情"
  );
};
