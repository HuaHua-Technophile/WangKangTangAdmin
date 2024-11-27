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
        historyRoutes.value.push(route); // 检查是否已经存在，不存在则写入历史路由
    };

    const router = useRouter();
    const removeRoute = (path: string) => {
      const index = historyRoutes.value.findIndex((i) => i.path === path); //findIndex 会在找到匹配项后立即停止遍历,filter 会遍历整个数组
      historyRoutes.value.splice(index, 1); // 删除路由

      const isCurrentRoute = router.currentRoute.value.path === path; // 判断待关闭路由是否为当前激活项
      // debugLog(`关闭了第${index}历史路由`, path, toRaw(historyRoutes.value));
      if (historyRoutes.value.length == 0)
        router.push("/"); //路由被全部关掉了，跳转布局组件
      else if (isCurrentRoute) router.go(-1);
      //路由还剩下，但是关闭的是当前路由，则跳回上一个
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
