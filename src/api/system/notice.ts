/**
 * @file notice-api.ts
 * @description 定义与通知/公告相关的 API 接口函数，包括查询、删除、新增和修改操作。
 * 本文件通过封装 HTTP 请求，提供通知模块的统一接口调用。
 */

import { NoticeItem, NoticeParams } from "@/types/system/notice";
import { customRequest } from "../instance";

/**
 * 查询通知/公告列表
 * @function getNoticeList
 * @param {NoticeParams} params - 查询参数，包括分页信息和筛选条件。
 * @example
 * getNoticeList({ page: 1, pageSize: 10, noticeTitle: "公告" }).then((data) => {
 *   console.log(data);
 * });
 */
export const getNoticeList = (params: NoticeParams) => {
  return customRequest<NoticeItem[]>(
    {
      method: "GET",
      url: "/system/notice/list",
      params,
    },
    "获取通知/公告列表"
  );
};

/**
 * 删除通知/公告
 * @function delNotices
 * @param {number[]} noticeIds - 要删除的通知/公告 ID 数组。
 * @example
 * delNotices([1, 2, 3]).then(() => {
 *   console.log("删除成功");
 * });
 */
export const delNotices = (noticeIds: number[]) => {
  return customRequest(
    {
      method: "DELETE",
      url: `/system/notice/${noticeIds}`,
    },
    `删除通知/公告 ${noticeIds}`
  );
};

/**
 * 新增通知/公告
 * @function addNotice
 * @param {NoticeItem} data - 新增的通知/公告数据。
 * @example
 * addNotice({
 *   noticeTitle: "新公告",
 *   noticeContent: "这是一个新公告",
 *   status: "published",
 * }).then(() => {
 *   console.log("新增成功");
 * });
 */
export const addNotice = (data: NoticeItem) => {
  return customRequest(
    {
      method: "POST",
      url: "/system/notice",
      data,
    },
    "新增通知/公告"
  );
};

/**
 * 修改通知/公告
 * @function editNotice
 * @param {NoticeItem} data - 修改的通知/公告数据，需包含通知 ID。
 * @example
 * editNotice({
 *   noticeId: 1,
 *   noticeTitle: "修改后的公告",
 *   noticeContent: "这是修改后的内容",
 *   status: "draft",
 * }).then(() => {
 *   console.log("修改成功");
 * });
 */
export const editNotice = (data: NoticeItem) => {
  return customRequest(
    {
      method: "PUT",
      url: "/system/notice",
      data,
    },
    "修改通知/公告"
  );
};
