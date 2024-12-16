// 通用状态枚举（用于多个0/1状态字段）
export enum CommonStatus {
  OFF = 0,
  ON = 1,
}

// 药品接口定义
export interface ProductItem {
  id: number; // 主键
  name: string; // 商品名称
  imageUrl: string; // 商品封面图片URL
  freightTemplateId: number; // 请当作是运费金额!!!并非id
  categoryId?: number; // 分类ID
  sale: number; // 销量
  note?: string; // 备注（可选）
  recommendStatus?: CommonStatus; // 推荐状态
  isPrescription?: CommonStatus; // 是否处方药
  illustrate: string; // 药品说明书
}

// 药品列表查询参数接口
export type GetProductListParams = PaginationParams &
  Pick<ProductItem, "recommendStatus" | "isPrescription">;

// 批量修改状态参数接口
export interface UpdateStatusParams {
  ids: number[];
  status: CommonStatus;
}
