export interface StoreItem {
  id?: number; // 主键
  storeName: string; // 店铺名称
  address?: string; // 地址
  businessHours?: string; // 营业时间
  phone: string; // 电话
  status?: 0 | 1; // 状态 0:禁用, 1:启用
}
