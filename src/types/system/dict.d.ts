/**
 * @file dictTypes.ts
 * @description 定义字典类型和字典数据的相关接口和类型，支持分页参数的扩展。
 */

import { PaginationParams } from "@/types/pagination";

/**
 * @interface DictTypeItem
 * @description 定义字典类型的接口
 * @property {number} [dictId] - 字典类型的唯一标识符
 * @property {string} [dictName] - 字典类型的名称
 * @property {string} [dictType] - 字典类型的标识
 * @property {"" | "0" | "1"} status - 字典类型的状态，""表示全部，"0"表示正常，"1"表示停用
 */
export interface DictTypeItem {
  dictId?: number;
  dictName?: string;
  dictType?: string;
  status: "" | "0" | "1";
}

/**
 * @description 字典类型查询参数类型，继承分页参数并包含部分字段筛选
 * @extends PaginationParams
 * @property {string} [dictName] - 字典类型名称的筛选条件
 * @property {string} [dictType] - 字典类型标识的筛选条件
 * @property {"" | "0" | "1"} [status] - 字典类型状态的筛选条件
 */
export type DictTypeParams = PaginationParams &
  Pick<DictTypeItem, "status" | "dictName" | "dictType">;

/**
 * @interface DictDataItem
 * @description 定义字典数据的接口
 * @property {string} [dictType] - 不可修改，表示父字典类型
 * @property {number} [dictCode] - 不可修改，字典数据的唯一标识符
 * @property {string} [dictLabel] - 字典数据的标签
 * @property {number} [dictSort] - 字典数据的排序字段
 * @property {string | number} [dictValue] - 字典数据的值
 * @property {string} [cssClass] - 自定义样式类名
 * @property {"default" | "primary" | "success" | "info" | "warning" | "danger"} [listClass] - 列表项的样式类名
 * @property {"0" | "1"} [status] - 字典数据的状态，"0"表示正常，"1"表示停用
 */
export interface DictDataItem {
  dictType?: string; // 不可修改，表示父字典类型
  dictCode?: number; // 不可修改，字典数据的唯一标识符
  dictLabel?: string;
  dictSort?: number;
  dictValue?: string | number;
  cssClass?: string;
  listClass?: "default" | "primary" | "success" | "info" | "warning" | "danger";
  status?: "0" | "1";
}

/**
 * @description 字典数据查询参数类型，继承分页参数并包含部分字段筛选
 * @extends PaginationParams
 * @property {string} [dictType] - 父字典类型，用于筛选字典数据
 * @property {"0" | "1"} [status] - 字典数据状态的筛选条件
 */
export type DictDataParams = PaginationParams &
  Pick<DictDataItem, "status" | "dictType">;
