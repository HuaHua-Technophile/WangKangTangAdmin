// src/api/login.ts

import { customRequest } from "./instance";

interface LoginData {
  username: string;
  password: string;
}

export const login = (data: LoginData) => {
  return customRequest(
    {
      url: "/login",
      method: "POST",
      data,
    },
    "登录"
  );
};
