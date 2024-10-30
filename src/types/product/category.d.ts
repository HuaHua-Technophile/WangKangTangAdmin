// @/types/product/category.ts

export interface CategoryItem {
  id: number;
  name?: string;
  parentId: number;
  orderNum: number;
  status?: string;
  // 其他必要的字段...
}

export type CategoryParams = PaginationParams &
  Pick<CategoryItem, "name" | "status">;
