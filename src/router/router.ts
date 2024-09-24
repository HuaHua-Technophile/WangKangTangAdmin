// src/router/index.ts
import { createWebHistory, createRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

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
    },
    {
      path: "/",
      redirect: "/main",
      children: [
        {
          path: "",
          name: "Main",
          component: () => import("@/views/Main.vue"),
          meta: { requiresAuth: true },
        },
        // ... 其他路由
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // 需要认证但未登录，重定向到登录页
    next({ name: "Login", query: { redirect: to.fullPath } });
  } else if (to.name === "Login" && authStore.isAuthenticated) {
    // 已登录用户试图访问登录页，重定向到首页
    next({ name: "Main" });
  } else {
    // 其他情况正常导航
    next();
  }
});

export default router;
