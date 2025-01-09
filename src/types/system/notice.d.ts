/**
 * @file notice-types.ts
 * @description 定义与通知相关的数据类型，包括通知项(NoticeItem)和通知参数(NoticeParams)。
 * 本文件用于在项目中提供通知模块所需的类型定义，确保类型安全和代码可读性。
 */

import { PaginationParams } from "../pagination";

/**
 * @interface NoticeItem
 * @description 表示单个通知的结构。
 */
export interface NoticeItem {
  /**
   * @property {number} [noticeId]
   * @description 通知的唯一标识符 (可选)。
   */
  noticeId?: number;

  /**
   * @property {string} [noticeTitle]
   * @description 通知的标题 (可选)。
   */
  noticeTitle?: string;

  /**
   * @property {string} [noticeType]
   * @description 通知的类型，例如公告、提醒等 (可选)。
   */
  noticeType?: string;

  /**
   * @property {string} noticeContent
   * @description 通知的具体内容。
   */
  noticeContent: string;

  /**
   * @property {string} status
   * @description 通知的状态，例如已发布、草稿等。
   */
  status: string;

  /**
   * @property {string} [createBy]
   * @description 创建通知的用户 (可选)。
   */
  createBy?: string;
}

/**
 * @description 用于查询通知的参数类型，继承自分页参数，并包含部分通知字段。
 * @extends PaginationParams
 * @property {string} [noticeTitle] - 查询条件：通知标题 (可选)。
 * @property {string} [createBy] - 查询条件：创建人 (可选)。
 * @property {string} [noticeType] - 查询条件：通知类型 (可选)。
 */
export type NoticeParams = PaginationParams &
  Pick<NoticeItem, "noticeTitle" | "createBy" | "noticeType">;
