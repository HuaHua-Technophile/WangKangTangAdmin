// src/stores/history.ts
import { ref } from "vue";
import { defineStore } from "pinia";

export const useHistoryStore = defineStore(
  "history",
  () => {
    const historyRoutes = ref<{ path: string; title: string }[]>([]); // 存储历史路由

    const addRoute = (route: { path: string; title: string }) => {
      // 检查是否已经存在
      if (!historyRoutes.value.some((i) => i.path === route.path)) {
        historyRoutes.value.push(route);
      }
    };

    return {
      historyRoutes,
      addRoute,
    };
  },
  {
    persist: true,
  }
);
