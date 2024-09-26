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
      const index = historyRoutes.value.findIndex((i) => i.path === path); //findIndex 会在找到匹配项后立即停止遍历,filter 会遍历整个数组
      historyRoutes.value.splice(index, 1); // 删除路由

      const isCurrentRoute = router.currentRoute.value.path === path; // 判断待关闭路由是否为当前激活项

      if (isCurrentRoute && historyRoutes.value.length > 0) router.go(-1);
      else router.push("/"); // 如果没有匹配项，跳转到首页或其他默认页面
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
