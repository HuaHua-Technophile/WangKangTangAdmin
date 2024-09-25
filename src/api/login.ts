// src/api/login.ts

import { customRequest } from "./instance";

export const login = (data: any) => {
  return customRequest(
    {
      url: "/login",
      method: "POST",
      data,
    },
    "登录"
  );
};
