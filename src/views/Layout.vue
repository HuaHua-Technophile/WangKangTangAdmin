<template>
  <el-container class="vw-100 vh-100">
    <!-- 左侧菜单 -->
    <el-aside width="150px" class="border-end">
      <el-scrollbar>
        <el-menu router :default-active="activePath" class="border-0">
          <template v-for="route in processedRoutes">
            <!-- 如果有子路由，显示为 sub-menu -->
            <el-sub-menu
              v-if="route.children && route.children.length"
              :index="route.path">
              <template #title>
                <Icon :icon="route.meta?.icon" />
                <span class="ms-2">{{ route.meta?.title }}</span>
              </template>
              <el-menu-item
                v-for="child in route.children.filter((c:CustomRouteRecordRaw) => !c.hidden)"
                :index="route.path + '/' + child.path"
                class="transition1000">
                <Icon :icon="child.meta?.icon" />
                <span class="ms-2">{{ child.meta?.title }}</span>
              </el-menu-item>
            </el-sub-menu>
            <!-- 如果没有子路由，直接显示为 menu-item -->
            <el-menu-item
              v-else
              :index="'/' + route.path"
              class="transition1000">
              <Icon :icon="route.meta?.icon" />
              <span class="ms-2">{{ route.meta?.title }}</span>
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
  /**
   * @module MainLayout
   * @description 主布局组件逻辑部分，包含状态管理和数据获取。
   */

  import { getInfo } from "@/api/getInfo";
  import { useAuthStore } from "@/stores/auth";
  import { debugLog } from "@/utils/debug";
  import { computed, onMounted, ref, toRaw } from "vue";
  import { useHistoryStore } from "@/stores/history";
  import { useRoute } from "vue-router";
  import { useThemeStore } from "@/stores/theme";
  import { CustomRouteRecordRaw } from "@/types/router";

  const authStore = useAuthStore();

  /**
   * @constant {ComputedRef<CustomRouteRecordRaw[]>} processedRoutes
   * @description 过滤并处理动态路由，移除隐藏的路由。
   */
  const processedRoutes = computed(() => {
    const filteredRoutes = authStore.dynamicRoutes.filter(
      (route) => !route.hidden
    );
    let result: CustomRouteRecordRaw[] = [];

    filteredRoutes.forEach((route) => {
      if (route.path === "/") {
        // 如果是根路由，将其子路由提取出来
        if (route.children && route.children.length) {
          const filteredChildren = route.children.filter(
            (child: CustomRouteRecordRaw) => !child.hidden
          ); // 过滤子路由中 hidden 为 true 的项
          result = result.concat(filteredChildren);
        }
      } else result.push(route); // 其他路由直接添加
    });
    return result;
  });

  /**
   * @constant {string} baseUrl
   * @description API 基础 URL，从环境变量中获取。
   */
  const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;

  /**
   * @constant {Ref<any>} userInfo
   * @description 当前登录用户的信息。
   */
  const userInfo = ref();

  /**
   * @function onMounted
   * @description 组件挂载时获取用户信息。
   */
  onMounted(async () => {
    userInfo.value = await getInfo();
    debugLog("个人信息=>", toRaw(userInfo.value));
  });

  // 历史路由状态
  const historyStore = useHistoryStore();

  // 当前激活路由
  const route = useRoute();
  const activePath = computed(() => route.path);

  // 主题色状态
  const themeStore = useThemeStore();
</script>

<style lang="scss" scoped>
  /**
 * @description 样式部分，主要针对 Element Plus 组件和自定义样式的调整。
 */
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
