// src/api/getInfo.ts

import { customRequest } from "./instance";

export const getInfo = () => {
  return customRequest(
    {
      url: "/getInfo",
      method: "GET",
    },
    "获取用户信息"
  );
};
