/**
 * @file history.ts
 * @description Pinia Store 用于管理路由历史记录的模块。
 * 提供添加路由、删除路由等功能，并支持持久化存储。
 * @module stores/history
 */

import { ref } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";

/**
 * 使用 Pinia 定义的 history Store。
 * 管理路由历史记录的逻辑。
 */
export const useHistoryStore = defineStore(
  "history",
  () => {
    /**
     * 历史路由记录列表。
     * 每个路由对象包含 `path` 和 `title` 属性。
     */
    const historyRoutes = ref<{ path: string; title: string }[]>([]);

    /**
     * 添加一个新的路由到历史记录中。
     * 如果该路由已经存在，则不会重复添加。
     * @param {Object} route - 路由对象。
     * @param {string} route.path - 路由的路径。
     * @param {string} route.title - 路由的标题。
     * @returns {void}
     */
    const addRoute = (route: { path: string; title: string }): void => {
      if (!historyRoutes.value.some((i) => i.path === route.path)) {
        historyRoutes.value.push(route);
      }
    };

    const router = useRouter();

    /**
     * 从历史记录中移除一个路由。
     * 如果移除的路由是当前激活路由，则会自动跳转到前一个路由或首页。
     * @param {string} path - 要移除的路由路径。
     * @returns {void}
     */
    const removeRoute = (path: string): void => {
      const index = historyRoutes.value.findIndex((i) => i.path === path);
      if (index !== -1) {
        historyRoutes.value.splice(index, 1); // 删除指定路由
      }

      const isCurrentRoute = router.currentRoute.value.path === path;

      if (historyRoutes.value.length === 0) {
        // 如果历史记录为空，跳转到首页
        router.push("/");
      } else if (isCurrentRoute) {
        // 如果移除的是当前激活路由，跳转到上一个路由
        router.go(-1);
      }
    };

    return {
      historyRoutes,
      addRoute,
      removeRoute,
    };
  },
  {
    /**
     * 是否启用持久化存储。
     * 当设置为 `true` 时，Pinia 的插件将自动保存和加载该 Store 的数据。
     */
    persist: true,
  }
);
