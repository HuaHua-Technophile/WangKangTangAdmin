// src/router/index.ts
import { createWebHistory, createRouter, RouteRecordRaw } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { debugLog } from "@/utils/debug";
import { getRouters } from "@/api/routes";

const addRoute = (routes: RouteRecordRaw[]) => {
  // 动态添加路由
  routes.forEach((i) => {
    i.children?.forEach((j) => {
      router.addRoute("Layout", {
        path: i.path + "/" + j.path,
        name: j.name,
        component: () => import(`/src/views/layout/${j.component}.vue`),
      });
    });
  });

  const allRoutes = router.getRoutes();
  debugLog("当前动态添加的路由列表:", allRoutes);
};

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
        if (router.getRoutes().length > 3)
          next(); //已经添加过了路由(不再是初始3条)，仍无法匹配
        else {
          const authStore = useAuthStore();

          // 检查用户是否已存有路由
          if (authStore.dynamicRoutes.length > 0)
            addRoute(authStore.dynamicRoutes);
          else if (authStore.isAuthenticated) {
            // 用户已认证，但动态路由未请求，尝试重新加载
            const routes = await getRouters();
            debugLog("返回动态路由=>", routes); // 请求动态路由
            authStore.dynamicRoutes = routes; // 存储动态路由
            addRoute(routes);
          } else next({ name: "Login" }); // 未认证，重定向到登录页

          next({ path: to.path }); // 再跳转回原本的
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

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated)
    next({
      name: "Login",
      query: { redirect: to.fullPath },
    });
  // 需要认证但未登录，重定向到登录页
  else if (to.name === "Login" && authStore.isAuthenticated)
    next({ name: "Layout" }); // 已登录用户试图访问登录页，重定向空组件页面
  else next(); // 其他情况正常导航
});

export default router;
