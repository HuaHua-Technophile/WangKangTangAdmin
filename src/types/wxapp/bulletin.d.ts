import { PaginationParams } from "../pagination";

/**
 * BulletinItem 表示一个小程序公告的数据结构
 */
export interface BulletinItem {
  /** id */
  id?: number;
  /** 公告标题 */
  title: string;
  /** 图片的 URL 地址 */
  imgUrl?: string;
  /** 公告的详细内容 */
  content?: string;
  /** 公告的状态 0有效 1过期 */
  status?: 0 | 1;
}
export type GetBulletinListParams = BulletinItem & PaginationParams;
