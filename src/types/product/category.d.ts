// @/types/product/category.ts

export interface CategoryItem {
  id?: number;
  name?: string; //分类名称
  parentId?: number; //父分类
  ancestors?: array; //祖级列表
  icon?: string; //分类的示意图片
  miniImg?: string; // 缩略图
  sort: number; //排序
  status?: number; //0禁用 1启用
  children?: CategoryItem[]; //子分类
}

export type CategoryParams = PaginationParams &
  Pick<CategoryItem, "name" | "status">;
