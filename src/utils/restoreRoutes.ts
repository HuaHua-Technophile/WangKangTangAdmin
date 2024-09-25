import { getRouters } from "@/api/routes";
import router from "@/router/router";
import { useAuthStore } from "@/stores/auth";
import { debugLog } from "@/utils/debug";
import { RouteRecordRaw } from "vue-router";

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

// 检查用户是否已认证
export const restoreRoutes = async () => {
  const authStore = useAuthStore();
  // 从 Pinia 恢复动态路由
  const routes = authStore.dynamicRoutes;
  if (routes.length > 0) addRoute(routes);
  else if (authStore.isAuthenticated) {
    // 用户已认证，但动态路由未加载，尝试重新加载
    const routes = await getRouters();
    debugLog("返回动态路由=>", routes); // 请求动态路由
    authStore.dynamicRoutes = routes; // 存储动态路由
    addRoute(routes);
  } else router.push({ name: "Login" }); // 未认证，重定向到登录页
};
