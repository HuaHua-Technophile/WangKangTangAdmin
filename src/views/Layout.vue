<template>
  <el-container class="vw-100 vh-100">
    <!-- 左侧菜单 -->
    <el-aside width="150px" class="border-end">
      <el-scrollbar>
        <el-menu router :default-active="activePath" class="border-0">
          <el-sub-menu
            v-for="(i, index) in authStore.dynamicRoutes"
            :key="i.meta?.title"
            :index="index.toString()">
            <template #title>
              <Icon icon="icon-moon" />
              <span class="ms-2">{{ i.meta?.title }}</span>
            </template>
            <el-menu-item
              v-for="j in i.children"
              :key="j.meta?.title"
              :index="i.path + '/' + j.path">
              <span class="ms-2">{{ j.meta?.title }}</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <!-- 顶栏:历史路由、用户信息 -->
      <el-header
        class="d-flex justify-content-between align-items-center border-bottom">
        <!-- 历史路由 -->
        <el-scrollbar view-class="h-100 d-flex align-items-end">
          <div class="h-75 d-flex">
            <div
              v-for="i in historyStore.historyRoutes"
              :key="i.path"
              :class="{ active: i.path === activePath }"
              class="historyRoute position-relative me-1 border rounded-top-3 transition750 bg-primary-subtle d-flex align-items-center">
              <router-link
                :to="i.path"
                class="text-decoration-none h-100 d-flex align-items-center text-nowrap px-2">
                {{ i.title }}
              </router-link>
              <!-- 历史路由关闭按钮 -->
              <Icon
                icon="icon-guanbi"
                :size="19"
                class="historyRouteClose transition500 position-absolute end-0 me-1 text-primary"
                @click.stop="historyStore.removeRoute(i.path)" />
            </div>
          </div>
        </el-scrollbar>
        <!-- 用户信息/退出登录 -->
        <el-dropdown class="me-5 h-100">
          <div class="px-2 d-flex align-items-center">
            <el-avatar :size="35" :src="avatar" />
            <span class="fw-bold ms-2">{{ userInfo?.user?.nickName }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <Icon icon="icon-yonghu" />
                <span class="ms-1">个人信息</span>
              </el-dropdown-item>
              <el-dropdown-item @click="logout">
                <Icon icon="icon-tuichu"></Icon>
                <span class="ms-1">退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <!-- 内容 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script lang="ts" setup>
  import { getInfo } from "@/api/getInfo";
  import router from "@/router/router";
  import { useAuthStore } from "@/stores/auth";
  import { debugLog } from "@/utils/debug";
  import { computed, onMounted, ref } from "vue";

  const authStore = useAuthStore();
  // 用户信息不持久化存储--------------------
  const userInfo = ref();
  import avatar from "@/assets/images/TestLogo.webp"; // 使用 require
  onMounted(async () => {
    userInfo.value = await getInfo();
    debugLog("用户信息=>", userInfo.value);
  });
  const logout = () => {
    authStore.token = "";
    authStore.dynamicRoutes = [];
    historyStore.historyRoutes = [];
    router.push("/login");
    debugLog("退出登录");
  };

  // 历史路由-----------------
  import { useHistoryStore } from "@/stores/history";
  import { useRoute } from "vue-router";
  const historyStore = useHistoryStore();

  // 当前激活路由------------
  const route = useRoute();
  const activePath = computed(() => route.path);
</script>
<style lang="scss" scoped>
  .el-menu-item.is-active {
    background: var(--bs-primary-bg-subtle);
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
        color: var(--theme-color);
        transform: scale(1.1) rotate(90deg) !important;
      }
    }
  }
</style>
