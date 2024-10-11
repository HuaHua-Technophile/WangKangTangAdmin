// src/types/axios.d.ts
import { AxiosResponse } from "axios";
import { RoleItem } from "./system/role";
import { MenuTreeItem } from "./system/menu";

// 扩展 AxiosResponse 接口
declare module "axios" {
  interface AxiosResponse<T = any> {
    code: 200 | 401 | 403 | 500 | 601;
    msg: string;
    data?: T;
    total?: number;
    token?: string;
    rows?: T;
    menus?: T;
    checkedKeys?: number[];
  }
}
