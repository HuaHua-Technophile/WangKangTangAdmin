import { BulletinItem, GetBulletinListParams } from "@/types/wxapp/bulletin";
import { customRequest } from "../instance";

/**
 * 添加公告
 *
 * @param data - 新公告的内容
 * @returns Promise 包含添加结果的响应数据
 */
export const addBulletin = (data: BulletinItem) => {
  return customRequest(
    {
      url: "/system/bulletin/add",
      method: "POST",
      data,
    },
    "添加公告"
  );
};

/**
 * 批量删除公告
 *
 * @param ids - 要删除的公告 ID 列表
 * @returns Promise 包含删除结果的响应数据
 */
export const delBulletins = (ids: number[]) => {
  return customRequest(
    {
      url: `/system/bulletin/delete/${ids}`,
      method: "DELETE",
    },
    "批量删除公告"
  );
};

/**
 * 获取公告列表
 *
 * @param params - 查询参数
 * @returns Promise 包含公告列表的响应数据
 */
export const getBulletinList = (params: GetBulletinListParams) => {
  return customRequest<BulletinItem[]>(
    {
      url: "/system/bulletin/list",
      method: "GET",
      params,
    },
    "获取公告列表"
  );
};

/**
 * 更新公告
 *
 * @param data - 更新后的公告数据
 * @returns Promise 包含更新结果的响应数据
 */
export const editBulletin = (data: BulletinItem) => {
  return customRequest(
    {
      url: "/system/bulletin/update",
      method: "PUT",
      data,
    },
    "更新公告"
  );
};
