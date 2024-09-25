<template>
  <el-container class="vw-100 vh-100">
    <!-- 左侧菜单 -->
    <el-aside width="150px" class="border-end">
      <el-scrollbar>
        <el-menu router :default-openeds="['0']" class="border-0">
          <el-sub-menu
            v-for="(i, index) in authStore.dynamicRoutes"
            :key="i.meta?.title"
            :index="index.toString()">
            <template #title>
              <Icon name="icon-moon" />
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
        <div></div>
        <!-- 用户信息/退出登录 -->
        <el-dropdown class="me-5 h-100">
          <div class="px-2 d-flex align-items-center">
            <el-image
              style="width: 33px; height: 33px"
              :src="'src/assets/images/益丰大药房.webp'"
              fit="cover"
              class="rounded-circle" />
            <span class="fw-bold ms-2">{{ userInfo?.user?.nickName }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <Icon name="icon-yonghu" />
                <span class="ms-1">个人信息</span>
              </el-dropdown-item>
              <el-dropdown-item @click="logout">
                <Icon name="icon-tuichu"></Icon>
                <span class="ms-1">退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script lang="ts" setup>
  import { getInfo } from "@/api/getInfo";
  import router from "@/router/router";
  import { useAuthStore } from "@/stores/auth";
  import { debugLog } from "@/utils/debug";
  import { onMounted, ref } from "vue";

  const authStore = useAuthStore();
  // 用户信息不持久化存储--------------------
  const userInfo = ref();
  onMounted(async () => {
    userInfo.value = await getInfo();
    debugLog("用户信息=>", userInfo.value);
  });
  const logout = () => {
    authStore.token = "";
    authStore.dynamicRoutes = [];
    router.push("/login");
    debugLog("退出登录");
  };
</script>
<style lang="scss" scoped>
  .el-header {
    --el-header-height: 2.5rem;
  }
</style>
