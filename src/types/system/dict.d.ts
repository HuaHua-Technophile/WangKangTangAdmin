import { PaginationParams } from "@/types/pagination";
// 定义接口

export interface DictTypeItem {
  dictId?: number;
  dictName?: string;
  dictType?: string;
  status: "" | "0" | "1";
}
export type DictTypeParams = PaginationParams &
  Pick<DictTypeItem, "status" | "dictName" | "dictType">;

export interface DictDataItem {
  dictType?: string; //不可修改,表示父字典类型
  dictCode?: number; //不可修改,唯一标识符
  dictLabel?: string;
  dictSort?: number;
  dictValue?: string | number;
  cssClass?: string;
  listClass?: "default" | "primary" | "success" | "info" | "warning" | "danger";
  status?: "0" | "1";
}
export type DictDataParams = PaginationParams &
  Pick<DictDataItem, "status" | "dictType">;
