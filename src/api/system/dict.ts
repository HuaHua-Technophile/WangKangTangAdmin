import { customRequest } from "@/api/instance";
import { DictTypeData, DictTypeParams } from "@/types/system/dict";

// 1. 查询字典类型列表
export const getDictTypeList = (params: DictTypeParams) => {
  return customRequest<DictTypeData[]>(
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
export const addDictType = (data: Omit<DictTypeData, "dictId">) => {
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
export const editDictType = (data: DictTypeData) => {
  return customRequest(
    {
      method: "PUT",
      url: "/system/dict/type",
      data,
    },
    "修改字典类型"
  );
};
