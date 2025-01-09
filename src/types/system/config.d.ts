/**
 * @fileoverview 系统配置相关的类型定义
 * @module @/types/system/config
 */

import { PaginationParams } from "@/types/pagination";

/**
 * 系统配置项接口
 * @interface ConfigItem
 * @description 定义了系统配置项的数据结构
 */
export interface ConfigItem {
  /** 配置ID */
  configId?: number;

  /** 配置名称 */
  configName?: string;

  /** 配置键名 */
  configKey?: string;

  /** 配置值 */
  configValue: string;

  /**
   * 配置类型
   * @example "Y" | "N" 表示是否类型
   */
  configType?: string;

  /** 创建者 */
  createBy?: string;

  /**
   * 创建时间
   * @format ISO 8601 日期时间字符串
   */
  createTime?: string;

  /** 更新者 */
  updateBy?: string;

  /**
   * 更新时间
   * @format ISO 8601 日期时间字符串
   */
  updateTime?: string;

  /** 备注说明 */
  remark?: string;
}

/**
 * 配置查询参数类型
 * @typedef {Object} ConfigParams
 * @description 继承分页参数并包含配置查询相关字段
 * @extends {PaginationParams}
 */
export type ConfigParams = PaginationParams &
  Pick<ConfigItem, "configName" | "configKey" | "configType">;
