/**
 * @file src/router/index.ts
 * @description 配置应用的路由系统，包括静态路由和动态路由的加载逻辑。
 * 使用 Vue Router 来管理页面导航，并集成了权限验证、动态路由添加和历史路由记录等功能。
 */

import { createWebHistory, createRouter, RouteRecordRaw } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { debugError, debugLog } from "@/utils/debug";
import { getRouters } from "@/api/routes";
import { useHistoryStore } from "@/stores/history";

// 预加载所有可能的组件
const modules = import.meta.glob("/src/views/layout/**/*.vue");

/**
 * 动态添加路由到路由器中。
 * @param {RouteRecordRaw[]} routeList - 动态路由列表。
 */
const addRoute = (routeList: RouteRecordRaw[]): void => {
  routeList.forEach((i) => {
    i.children?.forEach((j) => {
      const componentPath = `/src/views/layout/${j.component}.vue`;
      if (modules[componentPath]) {
        router.addRoute("Layout", {
          path: i.path == "/" ? "/" + j.path : i.path + "/" + j.path,
          name: j.name,
          meta: {
            title: j.meta?.title,
          },
          component: modules[componentPath], // 使用预加载的组件
        });
      } else {
        debugError(`路由未找到: ${componentPath}`);
      }
    });
  });

  router.addRoute("Layout", {
    path: "/CurrentUserProfile",
    name: "CurrentUserProfile",
    meta: {
      title: "当前用户信息",
    },
    component: () => import("@/views/layout/CurrentUserProfile.vue"),
  });

  const allRoutes = router.getRoutes();
  debugLog("当前动态添加的路由列表:", allRoutes);
};

/**
 * 创建 Vue Router 实例。
 * 包括静态路由和动态路由的初始化配置。
 */
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/Login.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/views/NotFound.vue"),
      beforeEnter: async (to, _from, next) => {
        if (router.getRoutes().length > 3) {
          // 已经添加过动态路由
          next();
        } else {
          const authStore = useAuthStore();

          // 检查用户是否已存有动态路由
          if (authStore.dynamicRoutes.length > 0) {
            addRoute(authStore.dynamicRoutes);
            next({ path: to.path }); // 再跳转回原本的
          } else if (authStore.isAuthenticated) {
            // 用户已认证但动态路由未加载
            const routes = (await getRouters()).data;
            debugLog("返回动态路由=>", routes);
            authStore.dynamicRoutes = routes; // 存储动态路由
            addRoute(routes);
            next({ path: to.path }); // 再跳转回原本的
          } else {
            // 未认证，重定向到登录页
            next({ name: "Login" });
          }
        }
      },
    },
    {
      path: "/",
      name: "Layout",
      component: () => import("@/views/Layout.vue"), // 主布局组件
      meta: { requiresAuth: true },
      children: [],
    },
  ],
});

/**
 * 全局路由守卫，处理权限验证和历史路由记录。
 */
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  const historyStore = useHistoryStore();

  // 需要认证但未登录，重定向到登录页
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({
      name: "Login",
      query: { redirect: to.fullPath },
    });
  }
  // 已登录用户试图访问登录页，重定向到主页面
  else if (to.name === "Login" && authStore.isAuthenticated) {
    next({ name: "Layout" });
  }
  // 其他情况正常导航
  else {
    if (to.meta.title) {
      historyStore.addRoute({ path: to.path, title: to.meta.title as string }); // 添加当前路由到历史路由
    }
    next();
  }
});

export default router;
