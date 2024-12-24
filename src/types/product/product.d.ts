// 药品接口定义
import { PaginationParams } from "@/types/pagination";
import { AttributeValueItem } from "@/types/product/attribute";
export interface SKUItem {
  id?: number; // 主键
  productId?: number; // 药品ID
  skuCode: string; // sku编码
  price: number; // 当前价格
  spData: string; // 规格参数
  stock?: number; // 库存
  sale?: number; // 销量
}
export interface ProductItem {
  id?: number; // 主键
  name: string; // 药品名称
  imageUrl: string; // 药品封面图片URL
  miniImg: string; // 药品封面缩略图
  freightTemplateId: number; // 并非id,请当作是运费金额!!!
  categoryId?: number; // 分类ID
  sale: number; // 销量
  note: string; // 备注（可选）
  recommendStatus?: 0 | 1; // 推荐状态 0否 1是
  isActive?: 0 | 1; //0下架 1上架
  isPrescription?: 0 | 1; // 是否处方药 0否 1是
  illustrate: string; // 药品介绍(详情)富文本
  instructionImagesList: {
    imageUrl: string;
    sort: number;
  }[]; //药品介绍(详情)图片列表
  attributeCategoryId: number | null; // 属于哪个属性分类
  productAttributeValueList: AttributeValueItem[]; // 药品属性
  skuStockList: SKUItem[]; // 药品规格
}

// 药品列表查询参数接口
export type GetProductListParams = PaginationParams &
  Pick<ProductItem, "recommendStatus" | "isPrescription">;
