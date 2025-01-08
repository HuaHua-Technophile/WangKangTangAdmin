// src/stores/auth.ts
import { computed, ref } from "vue";
import { defineStore } from "pinia";

import CryptoJS from "crypto-js"; // 引入加密库
import router from "@/router/router";
import { useHistoryStore } from "./history";
import { CustomRouteRecordRaw } from "@/types/router";

// 密钥，可以根据需要修改为更复杂的
const SECRET_KEY = "my-secret-key";

// 加密函数
const encrypt = (text: string): string => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

// 解密函数
const decrypt = (text: string): string => {
  const bytes = CryptoJS.AES.decrypt(text, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const useAuthStore = defineStore(
  "auth",
  () => {
    const token = ref<string>(""); // 存储 token
    const dynamicRoutes = ref<CustomRouteRecordRaw[]>([]); // 存储动态路由

    const isAuthenticated = computed(() => token.value !== ""); // 计算属性，判断是否已认证

    const logout = () => {
      token.value = ""; // 清空 token
      dynamicRoutes.value = []; // 清空动态路由
      const historyStore = useHistoryStore();
      historyStore.historyRoutes = []; // 清空历史记录
      router.push("/login"); // 重定向到登录页面
    };

    return {
      token,
      isAuthenticated,
      dynamicRoutes,
      logout,
    };
  },
  {
    persist: {
      // 自定义存储逻辑，进行加密解密
      storage: localStorage, // 或者 sessionStorage
      serializer: {
        // 对存储的 token 进行加密
        serialize: (state) => {
          const encryptedToken = encrypt(state.token); // 加密token
          const encryptedRoutes = encrypt(JSON.stringify(state.dynamicRoutes)); // 加密 dynamicRoutes
          return JSON.stringify({
            token: encryptedToken,
            dynamicRoutes: encryptedRoutes,
          });
        },
        // 对取出的数据进行解密
        deserialize: (value) => {
          const state = JSON.parse(value);
          if (state.token) state.token = decrypt(state.token); // 解密 token
          if (state.dynamicRoutes)
            state.dynamicRoutes = JSON.parse(decrypt(state.dynamicRoutes)); // 解密 dynamicRoutes

          return state;
        },
      },
    },
  }
);
