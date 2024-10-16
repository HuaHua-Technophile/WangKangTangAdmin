import { customRequest } from "@/api/instance";
import {
  DictDataItem,
  DictDataParams,
  DictTypeItem,
  DictTypeParams,
} from "@/types/system/dict";

// 1. 查询字典类型列表
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

// 2. 删除字典类型
export const delDictTypes = (dictIds: number[]) => {
  return customRequest(
    {
      method: "DELETE",
      url: `/system/dict/type/${dictIds.join(",")}`,
    },
    `删除字典类型 ${dictIds}`
  );
};

// 3. 新增字典类型
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

// 4. 修改字典类型
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

// 1. 查询字典数据列表
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

// 2. 删除字典数据
export const delDictData = (dictCodes: number[]) => {
  return customRequest(
    {
      method: "DELETE",
      url: `/system/dict/data/${dictCodes.join(",")}`,
    },
    `删除字典数据 ${dictCodes}`
  );
};

// 3. 新增字典数据
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

// 4. 修改字典数据
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
