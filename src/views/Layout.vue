<template>
  <el-container class="vw-100 vh-100">
    <el-aside width="150px">
      <el-scrollbar>
        <el-menu router :default-openeds="['0']">
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
      <el-header>Header</el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script lang="ts" setup>
  import { useAuthStore } from "@/stores/auth";

  const authStore = useAuthStore();
</script>
<style lang="scss" scoped></style>
