// src/types/axios.d.ts
import { AxiosResponse } from "axios";

// 扩展 AxiosResponse 接口
declare module "axios" {
  interface AxiosResponse<T = any> {
    token?: string; // 添加 token 属性，标记为可选
    msg?: string; // 添加 msg 属性，标记为可选
    user?: string; // 添加 user 属性，标记为可选
  }
}
