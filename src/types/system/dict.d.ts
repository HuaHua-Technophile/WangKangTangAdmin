import { PaginationParams } from "@/types/pagination";
// 定义接口

export interface DictTypeData {
  dictId?: number;
  dictName?: string;
  dictType?: string;
  status: "" | "0" | "1";
}
export type DictTypeParams = PaginationParams &
  Partial<Omit<DictTypeData, "dictId">>;
