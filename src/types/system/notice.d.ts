import { PaginationParams } from "../pagination";

export interface NoticeItem {
  noticeId?: number;
  noticeTitle?: string;
  noticeType?: string;
  noticeContent: string;
  status: string;
  createBy?: string;
}
export type NoticeParams = PaginationParams &
  Pick<NoticeItem, "noticeTitle" | "createBy" | "noticeType">;
