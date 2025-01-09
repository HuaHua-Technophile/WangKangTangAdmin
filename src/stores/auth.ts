/**
 * @file auth.ts
 * @description 认证状态管理模块，使用 Pinia 和 Vue 3 组合式 API 实现。
 * 提供用户认证状态的存储、动态路由管理以及加密/解密存储功能。
 * @module stores/auth
 */

import { computed, ref } from "vue";
import { defineStore } from "pinia";
import CryptoJS from "crypto-js"; // 引入加密库
import router from "@/router/router";
import { useHistoryStore } from "./history";
import { CustomRouteRecordRaw } from "@/types/router";

// 密钥，可以根据需要修改为更复杂的
const SECRET_KEY = "my-secret-key";

/**
 * 加密函数
 * @param {string} text - 需要加密的明文字符串
 * @returns {string} - 加密后的密文字符串
 */
const encrypt = (text: string): string => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

/**
 * 解密函数
 * @param {string} text - 需要解密的密文字符串
 * @returns {string} - 解密后的明文字符串
 */
const decrypt = (text: string): string => {
  const bytes = CryptoJS.AES.decrypt(text, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

/**
 * 定义认证状态的 Pinia Store
 * @returns {object} - 返回认证相关的状态和方法
 */
export const useAuthStore = defineStore(
  "auth",
  () => {
    /**
     * 用户的认证 token
     */
    const token = ref<string>("");

    /**
     * 动态路由列表
     */
    const dynamicRoutes = ref<CustomRouteRecordRaw[]>([]);

    /**
     * 是否已认证的计算属性
     */
    const isAuthenticated = computed(() => token.value !== "");

    /**
     * 用户登出操作，清空 token 和动态路由，并重定向到登录页面
     */
    const logout = (): void => {
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
        /**
         * 序列化存储数据（加密）
         * @param {object} state - 要存储的状态对象
         * @returns {string} - 序列化后的加密字符串
         */
        serialize: (state) => {
          const encryptedToken = encrypt(state.token); // 加密 token
          const encryptedRoutes = encrypt(JSON.stringify(state.dynamicRoutes)); // 加密 dynamicRoutes
          return JSON.stringify({
            token: encryptedToken,
            dynamicRoutes: encryptedRoutes,
          });
        },
        /**
         * 反序列化存储数据（解密）
         * @param {string} value - 存储中的加密字符串
         * @returns {object} - 解密后的状态对象
         */
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
