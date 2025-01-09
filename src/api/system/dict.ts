/**
 * @file dictApi.ts
 * @description 定义与字典类型和字典数据相关的API请求方法，支持字典的增删改查功能。
 */

import { customRequest } from "@/api/instance";
import {
  DictDataItem,
  DictDataParams,
  DictTypeItem,
  DictTypeParams,
} from "@/types/system/dict";

/**
 * @function getDictTypeList
 * @description 查询字典类型列表
 * @param {DictTypeParams} params - 查询参数，包括分页信息和筛选条件
 */
export const getDictTypeList = (params: DictTypeParams) => {
  return customRequest<DictTypeItem[]>(
    {
      method: "GET",
      url: "/system/dict/type/list",
      params,
    },
    "获取字典类型列表"
  );
};

/**
 * @function delDictTypes
 * @description 删除字典类型
 * @param {number[]} dictIds - 要删除的字典类型ID数组
 */
export const delDictTypes = (dictIds: number[]) => {
  return customRequest(
    {
      method: "DELETE",
      url: `/system/dict/type/${dictIds.join(",")}`,
    },
    `删除字典类型 ${dictIds}`
  );
};

/**
 * @function addDictType
 * @description 新增字典类型
 * @param {Omit<DictTypeItem, "dictId">} data - 新增的字典类型数据，省略dictId字段
 */
export const addDictType = (data: Omit<DictTypeItem, "dictId">) => {
  return customRequest(
    {
      method: "POST",
      url: "/system/dict/type",
      data,
    },
    "新增字典类型"
  );
};

/**
 * @function editDictType
 * @description 修改字典类型
 * @param {DictTypeItem} data - 修改后的字典类型数据
 */
export const editDictType = (data: DictTypeItem) => {
  return customRequest(
    {
      method: "PUT",
      url: "/system/dict/type",
      data,
    },
    "修改字典类型"
  );
};

/**
 * @function getDictDataList
 * @description 查询字典数据列表
 * @param {DictDataParams} params - 查询参数，包括分页信息和筛选条件
 */
export const getDictDataList = (params: DictDataParams) => {
  return customRequest<DictDataItem[]>(
    {
      method: "GET",
      url: "/system/dict/data/list",
      params,
    },
    "获取字典数据列表"
  );
};

/**
 * @function delDictData
 * @description 删除字典数据
 * @param {number[]} dictCodes - 要删除的字典数据的唯一标识符数组
 */
export const delDictData = (dictCodes: number[]) => {
  return customRequest(
    {
      method: "DELETE",
      url: `/system/dict/data/${dictCodes.join(",")}`,
    },
    `删除字典数据 ${dictCodes}`
  );
};

/**
 * @function addDictData
 * @description 新增字典数据
 * @param {Omit<DictDataItem, "dictCode">} data - 新增的字典数据，省略dictCode字段
 */
export const addDictData = (data: Omit<DictDataItem, "dictCode">) => {
  return customRequest(
    {
      method: "POST",
      url: "/system/dict/data",
      data,
    },
    "新增字典数据"
  );
};

/**
 * @function editDictData
 * @description 修改字典数据
 * @param {DictDataItem} data - 修改后的字典数据
 */
export const editDictData = (data: DictDataItem) => {
  return customRequest(
    {
      method: "PUT",
      url: "/system/dict/data",
      data,
    },
    "修改字典数据"
  );
};

/**
 * @function getDictDataByDictType
 * @description 根据字典类型获取字典数据
 * @param {string} dictType - 字典类型标识
 */
export const getDictDataByDictType = (dictType: string) => {
  return customRequest<DictDataItem[]>(
    {
      method: "GET",
      url: `/system/dict/data/type/${dictType}`,
    },
    `获取${dictType}的字典数据`
  );
};
