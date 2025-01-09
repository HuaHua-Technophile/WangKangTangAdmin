<!--
  文件名: ThemeSwitcher.vue
  描述: 该组件是一个主题切换器，允许用户在深色模式与浅色模式之间切换。
  功能: 
  - 使用 Element Plus 的 Switch 组件实现切换功能。
  - 通过 Pinia 状态管理获取和更新主题状态。
  - 自动更新 HTML 的 class 属性以反映当前主题。
  作者: [您的名字]
  日期: [填写日期]
-->

<template>
  <el-switch
    :size="'large'"
    :model-value="isDark"
    @update:model-value="toggleTheme"
    inline-prompt>
    <!-- 深色模式图标 -->
    <template #active-action><Icon icon="icon-moon" /></template>
    <!-- 浅色模式图标 -->
    <template #inactive-action><Icon icon="icon-taiyang" /></template>
  </el-switch>
</template>

<script setup lang="ts">
  // 引入 Pinia 的 storeToRefs 用于解构状态
  import { storeToRefs } from "pinia";
  // 引入主题状态管理的 Pinia Store
  import { useThemeStore } from "@/stores/theme";
  // 引入 Vue 的生命周期钩子
  import { onMounted } from "vue";

  /**
   * 引用主题状态管理的 store
   */
  const themeStore = useThemeStore();

  /**
   * 从主题 store 中解构出 isDark 属性
   */
  const { isDark } = storeToRefs(themeStore);

  /**
   * 从主题 store 中解构出 toggleTheme 和 updateHtmlClass 方法
   * @function toggleTheme - 切换主题模式的方法
   * @function updateHtmlClass - 更新 HTML 类名的方法，用于反映当前主题
   */
  const { toggleTheme, updateHtmlClass } = themeStore;

  /**
   * 在组件挂载时调用 updateHtmlClass 方法
   * 目的是确保 HTML 的类名与主题状态保持同步
   */
  onMounted(updateHtmlClass);
</script>
