// src/stores/auth.ts
import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { RouteRecordRaw } from "vue-router";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const token = ref<string>(""); // 存储 token
    const dynamicRoutes = ref<RouteRecordRaw[]>([]); // 存储动态路由
    // 计算属性，判断是否已认证
    const isAuthenticated = computed(() => token.value !== "");

    return {
      token,
      isAuthenticated,
      dynamicRoutes,
    };
  },
  {
    persist: true,
  }
);
