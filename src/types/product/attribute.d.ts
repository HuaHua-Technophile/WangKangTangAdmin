// 药品属性接口
export interface AttributeItem {
  id?: number;
  productAttributeCategoryId: number;
  name: string;
  selectType: 0 | 1 | 2; // 唯一/单选/多选
  inputType: 0 | 1; // 手工录入/列表选择
  inputList: string; // 可选值列表
  sort: number;
  relatedStatus: 0 | 1; // 是否关联
  handAddStatus: 0 | 1; // 是否支持手动新增
  type: 0 | 1; // 规格/参数
}
export type GetAttributeListParams = Pick<
  AttributeItem,
  | "name"
  | "selectType"
  | "inputType"
  | "relatedStatus"
  | "handAddStatus"
  | "type"
> &
  PaginationParams;

// 药品属性值接口
export interface AttributeValueItem {
  id?: number;
  productId: number;
  productAttributeId: number;
  value: string;
}
