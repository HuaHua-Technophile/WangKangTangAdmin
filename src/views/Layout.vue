<template>
  <el-container class="vw-100 vh-100">
    <!-- 左侧菜单 -->
    <el-aside width="150px" class="border-end">
      <el-scrollbar>
        <el-menu router :default-active="activePath" class="border-0">
          <template v-for="route in filteredRoutes" :key="route.path">
            <!-- 处理有children的多级菜单 -->
            <el-sub-menu
              v-if="route.children && route.children.length > 1"
              :index="route.path">
              <template #title>
                <Icon :icon="route.meta?.icon" />
                <span class="ms-2">{{ route.meta?.title }}</span>
              </template>
              <el-menu-item
                v-for="child in getVisibleChildren(route)"
                :key="child.path"
                :index="route.path + '/' + child.path"
                class="transition1000">
                <span class="ms-2">{{ child.meta?.title }}</span>
              </el-menu-item>
            </el-sub-menu>

            <!-- 处理单个一级菜单或只有一个子菜单的情况 -->
            <el-menu-item
              v-else
              :index="getMenuItemPath(route)"
              class="transition1000">
              <Icon :icon="getMenuItemIcon(route)" />
              <span class="ms-2">{{ getMenuItemTitle(route) }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <!-- 顶栏:历史路由、用户信息 -->
      <el-header
        class="d-flex justify-content-between align-items-center border-bottom p-0 px-md-3">
        <!-- 历史路由 -->
        <el-scrollbar view-class="h-100 d-flex align-items-end">
          <div class="h-75 d-flex">
            <div
              v-for="i in historyStore.historyRoutes"
              :key="i.path"
              :class="{ active: i.path === activePath }"
              class="historyRoute position-relative me-md-1 border rounded-top-3 transition750 bg-primary-subtle d-flex align-items-center">
              <router-link
                :to="i.path"
                class="text-decoration-none h-100 d-flex align-items-center text-nowrap px-md-2">
                {{ i.title }}
              </router-link>
              <!-- 历史路由关闭按钮 -->
              <Icon
                icon="icon-guanbi"
                :size="19"
                class="historyRouteClose transition500 position-absolute end-0 me-md-1 text-primary"
                @click.stop="historyStore.removeRoute(i.path)" />
            </div>
          </div>
        </el-scrollbar>
        <!-- 用户信息/退出登录 -->
        <el-dropdown class="me-5 h-100">
          <div class="px-2 d-flex align-items-center">
            <el-avatar :size="35" :src="baseUrl + userInfo?.user?.avatar" />
            <span class="fw-bold ms-2">{{ userInfo?.user?.nickName }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <Icon icon="icon-yonghu" />
                <RouterLink
                  to="/CurrentUserProfile"
                  class="ms-1 text-decoration-none"
                  >个人信息</RouterLink
                >
              </el-dropdown-item>
              <el-dropdown-item @click="authStore.logout()">
                <Icon icon="icon-tuichu"></Icon>
                <span class="ms-1">退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <!-- 内容 -->
      <el-main class="p-0">
        <el-scrollbar
          :class="themeStore.isDark ? 'bg-black' : 'bg-body-secondary'"
          class="px-md-3"
          wrap-class="rounded-3"
          view-class="py-md-3">
          <router-view class="rounded-3 border p-md-2 w-100 bg-body" />
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>
<script lang="ts" setup>
  import { getInfo } from "@/api/getInfo";
  import { useAuthStore } from "@/stores/auth";
  import { debugLog } from "@/utils/debug";
  import { computed, onMounted, ref, toRaw } from "vue";

  const authStore = useAuthStore();

  // 过滤可见路由
  const filteredRoutes = computed(() => {
    return authStore.dynamicRoutes.filter((route: any) => !route.hidden);
  });

  // 获取可见的子路由
  const getVisibleChildren = (route: any) => {
    return route.children?.filter((child: any) => !child.hidden) || [];
  };

  // 获取菜单项的路径
  const getMenuItemPath = (route: any) => {
    if (route.children && route.children.length === 1) {
      return `${route.path == "/" ? "" : route.path}/${route.children[0].path}`;
    }
    return route.path;
  };

  // 获取菜单项的图标
  const getMenuItemIcon = (route: any) => {
    if (route.children && route.children.length === 1) {
      return route.children[0].meta?.icon;
    }
    return route.meta?.icon;
  };

  // 获取菜单项的标题
  const getMenuItemTitle = (route: any) => {
    if (route.children && route.children.length === 1) {
      return route.children[0].meta?.title;
    }
    return route.meta?.title;
  };

  // 个人信息不持久化存储--------------------
  const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;

  const userInfo = ref();
  onMounted(async () => {
    userInfo.value = await getInfo();
    debugLog("个人信息=>", toRaw(userInfo.value));
  });

  // 历史路由-----------------
  import { useHistoryStore } from "@/stores/history";
  import { useRoute } from "vue-router";
  import { useThemeStore } from "@/stores/theme";
  const historyStore = useHistoryStore();

  // 当前激活路由------------
  const route = useRoute();
  const activePath = computed(() => route.path);

  // 主题色检测
  const themeStore = useThemeStore();
</script>
<style lang="scss" scoped>
  .el-menu-item {
    border-radius: 5px;
    margin: 4px 10px;
    height: calc(var(--el-menu-sub-item-height) - (4px * 2));
    padding-left: calc(
      var(--el-menu-base-level-padding) +
        (var(--el-menu-level) * var(--el-menu-level-padding)) - 10px
    ) !important;
    &.is-active {
      color: var(--bs-link-color);
      background: var(--bs-primary-border-subtle);
      border: var(--bs-primary-border-subtle) 1px solid;
      padding-left: calc(
        var(--el-menu-base-level-padding) +
          (var(--el-menu-level) * var(--el-menu-level-padding)) - 10px - 0.7px
      ) !important;
    }
  }
  .el-header {
    --el-header-height: 2.5rem;
  }
  .historyRoute {
    &::after {
      display: block;
      content: "";
      width: 0%;
      position: absolute;
      height: 3px;
      left: 0;
      bottom: 0;
      background-color: var(--bs-primary);
      transition: all 0.5s;
    }
    &:hover,
    &.active {
      padding-right: 1.3rem !important;
      &::after {
        width: 100%;
      }
      .historyRouteClose {
        transform: scale(1);
      }
    }
    .historyRouteClose {
      transform: scale(0);
      &:hover {
        color: rgb(189, 43, 43) !important;
        transform: scale(1.1) rotate(90deg) !important;
      }
    }
  }
</style>
