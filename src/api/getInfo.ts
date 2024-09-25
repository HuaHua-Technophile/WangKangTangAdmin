// src/api/getInfo.ts

import { service } from "./instance";

export const getInfo = async () => {
  const response = await service.get("/getInfo");
  return response; // 返回路由数据
};
