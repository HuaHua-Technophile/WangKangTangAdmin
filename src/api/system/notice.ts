import { NoticeItem, NoticeParams } from "@/types/system/notice";
import { customRequest } from "../instance";

// 1. 查询通知/公告列表
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

// 2. 删除通知/公告
export const delNotices = (noticeIds: number[]) => {
  return customRequest(
    {
      method: "DELETE",
      url: `/system/notice/${noticeIds}`,
    },
    `删除通知/公告 ${noticeIds}`
  );
};

// 3. 新增通知/公告
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

// 4. 修改通知/公告
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
