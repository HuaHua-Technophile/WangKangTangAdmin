// 商品属性分类接口
export interface AttributeCategoryItem {
  id: number;
  name: string;
  attributeCount: number;
  paramCount: number;
}
export type AttributeCategoryParams = PaginationParams &
  Pick<AttributeCategoryItem, "name">;
