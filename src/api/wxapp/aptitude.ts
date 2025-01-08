// aptitudeApi.ts
import { AptitudeItem } from "@/types/wxapp/aptitude";
import { customRequest } from "../instance";
import { PaginationParams } from "@/types/pagination";

// 新增资质图片
export const addAptitude = (data: AptitudeItem) => {
  return customRequest(
    {
      url: "/system/aptitude",
      method: "POST",
      data,
    },
    "新增资质图片"
  );
};

// 修改资质图片
export const editAptitude = (data: AptitudeItem) => {
  return customRequest(
    {
      url: "/system/aptitude",
      method: "PUT",
      data,
    },
    "修改资质图片"
  );
};

// 查询资质图片列表
export const getAptitudeList = (params: PaginationParams) => {
  return customRequest<AptitudeItem[]>(
    {
      url: "/system/aptitude/list",
      method: "GET",
      params,
    },
    "查询资质图片列表"
  );
};

// 删除资质图片
export const delAptitude = (ids: (string | number)[]) => {
  return customRequest(
    {
      url: `/system/aptitude/${ids}`,
      method: "DELETE",
    },
    `删除资质图片ID${ids}`
  );
};

// 获取资质图片详细信息
export const getAptitudeDetail = (id: string | number) => {
  return customRequest(
    {
      url: `/system/aptitude/${id}`,
      method: "GET",
    },
    `获取ID:${id}的资质图片详细信息`
  );
};
