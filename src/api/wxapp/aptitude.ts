/**
 * @file aptitudeApi.ts
 * @description 提供与资质图片管理相关的 API 接口，包括新增、修改、查询、删除及详情获取功能。
 * @author [您的姓名]
 * @date [当前日期]
 */

import { AptitudeItem } from "@/types/wxapp/aptitude";
import { customRequest } from "../instance";
import { PaginationParams } from "@/types/pagination";

/**
 * 新增资质图片。
 * @function addAptitude
 * @param {AptitudeItem} data - 资质图片数据。
 */
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

/**
 * 修改资质图片。
 * @function editAptitude
 * @param {AptitudeItem} data - 资质图片数据。
 */
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

/**
 * 查询资质图片列表。
 * @function getAptitudeList
 * @param {PaginationParams} params - 分页参数。
 */
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

/**
 * 删除资质图片。
 * @function delAptitude
 * @param {(string | number)[]} ids - 要删除的资质图片的 ID 数组。
 */
export const delAptitude = (ids: (string | number)[]) => {
  return customRequest(
    {
      url: `/system/aptitude/${ids}`,
      method: "DELETE",
    },
    `删除资质图片ID${ids}`
  );
};

/**
 * 获取资质图片的详细信息。
 * @function getAptitudeDetail
 * @param {string | number} id - 资质图片的 ID。
 */
export const getAptitudeDetail = (id: string | number) => {
  return customRequest(
    {
      url: `/system/aptitude/${id}`,
      method: "GET",
    },
    `获取ID:${id}的资质图片详细信息`
  );
};
