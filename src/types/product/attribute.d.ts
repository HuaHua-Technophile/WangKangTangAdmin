/**
 * @module types/attribute
 */
import { PaginationParams } from "@/types/pagination";

/**
 * 药品属性基础接口
 * @interface AttributeItem
 */
export interface AttributeItem {
  /** 属性ID */
  id?: number;
  /**
   * 属性类型
   * @type {0 | 1}
   * - 0: 规格
   * - 1: 参数
   */
  type: 0 | 1;
  /** 所属属性分类ID */
  productAttributeCategoryId: number;
  /** 属性名称 */
  name: string;
  /**
   * 选择类型
   * @type {0 | 1 | 2}
   * - 0: 唯一
   * - 1: 单选
   * - 2: 多选
   */
  selectType: 0 | 1 | 2;
  /**
   * 输入类型
   * @type {0 | 1}
   * - 0: 手工录入
   * - 1: 列表选择
   */
  inputType: 0 | 1;
  /** 可选值列表，多个选项以逗号分隔 */
  inputList: string;
  /** 排序字段 */
  sort: number;
  /**
   * 关联状态
   * @type {0 | 1}
   * - 0: 不关联
   * - 1: 关联
   */
  relatedStatus: 0 | 1;
  /**
   * 是否支持手动新增
   * @type {0 | 1}
   * - 0: 不支持
   * - 1: 支持
   */
  handAddStatus: 0 | 1;
}

/**
 * 扩展的药品属性接口，用于前端展示和操作
 * @interface AttributeItemUsing
 * @extends {AttributeItem}
 */
export interface AttributeItemUsing extends AttributeItem {
  /** 新增的可选项值 */
  newValue?: string;
  /** 当前选中的选项值 */
  currentValue?: string;
  /** 多选情况下选中的选项值数组 */
  selectedValues?: string[];
  /** 处理后的选项列表 */
  valueList?: string[];
  /** 原始选项列表备份 */
  originalValueList?: string[];
}

/**
 * 获取属性列表的参数类型
 * @typedef {Object} GetAttributeListParams
 * @property {AttributeItem['type']} type - 属性类型
 * @property {PaginationParams} pagination - 分页参数
 */
export type GetAttributeListParams = Pick<AttributeItem, "type"> &
  PaginationParams;

/**
 * 药品属性值接口
 * @interface AttributeValueItem
 */
export interface AttributeValueItem {
  /** 属性值ID */
  id?: number;
  /** 关联的产品ID */
  productId?: number;
  /** 关联的属性ID */
  productAttributeId?: number;
  /** 属性值 */
  value: string;
}
