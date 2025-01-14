import { PaginationParams } from "@/types/pagination";
/**
 * 首页推广轮播图类型定义
 */
export interface AdvertiseItem {
  /** 主键 */
  id?: bigint;
  /** 名称 */
  name: string;
  /** 图片地址 */
  pic: string;
  /** 开始时间 */
  startTime: string; // 使用 ISO 8601 标准的日期字符串
  /** 结束时间 */
  endTime: string; // 使用 ISO 8601 标准的日期字符串
  /** 上下线状态：0 -> 下线；1 -> 上线 */
  status?: 0 | 1;
  /** 点击数 */
  clickCount?: number;
  /** 下单数 */
  orderCount?: number;
  /** 链接地址 */
  url?: string;
  /** 备注 */
  note: string;
  /** 排序 */
  sort: number;
}
export type GetAdvertiseItemParams = PaginationParams &
  Pick<AdvertiseItem, "name" | "status" | "startTime" | "endTime">;
