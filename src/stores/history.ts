// src/stores/history.ts
import { ref } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
export const useHistoryStore = defineStore(
  "history",
  () => {
    const historyRoutes = ref<{ path: string; title: string }[]>([]); // 存储历史路由

    const addRoute = (route: { path: string; title: string }) => {
      if (!historyRoutes.value.some((i) => i.path === route.path))
        historyRoutes.value.push(route); // 检查是否已经存在
    };

    const router = useRouter();
    const removeRoute = (path: string) => {
      const index = historyRoutes.value.findIndex((i) => i.path === path);
      if (index !== -1) {
        historyRoutes.value.splice(index, 1); // 删除路由
        // 自动跳转逻辑
        if (historyRoutes.value.length > 0) {
          const nextRoute =
            historyRoutes.value[index] ||
            historyRoutes.value[index - 1] ||
            historyRoutes.value[0];
          router.push(nextRoute.path);
        } else router.push("/"); // 如果没有历史路由了，跳转到首页或其他默认页面
      }
    };
    return {
      historyRoutes,
      addRoute,
      removeRoute,
    };
  },
  {
    persist: true,
  }
);
