import { PaginationParams } from "@/types/pagination";
// 药品属性接口
export interface AttributeItem {
  id?: number;
  type: 0 | 1; // 规格/参数
  productAttributeCategoryId: number; //属于哪个属性分类
  name: string;
  selectType: 0 | 1 | 2; // 唯一/单选/多选
  inputType: 0 | 1; // 手工录入/列表选择
  inputList: string; // 可选值.如果是列表则用逗号隔开.
  sort: number;
  relatedStatus: 0 | 1; // 是否关联 0不关联 1关联
  handAddStatus: 0 | 1; // 是否支持手动新增 0不支持 1支持
}
export interface SpecificationItem extends AttributeItem {
  // 新增的可选属性
  newValue?: string; // 新值
  currentValue?: string; // 当前值
  selectedValues?: string[]; // 选中的值列表
  valueList?: string[]; // 值列表
  originalValueList?: string[]; // 原始值列表
}
export type GetAttributeListParams = Pick<AttributeItem, "type"> &
  PaginationParams;

// 药品属性值接口
export interface AttributeValueItem {
  id?: number;
  productId?: number;
  productAttributeId?: number;
  value: string;
}
