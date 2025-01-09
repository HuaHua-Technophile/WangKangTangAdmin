<template>
  <div>
    <!-- 右上角主题切换常驻 -->
    <div class="position-fixed top-0 end-0 px-2">
      <ThemeSwitch />
    </div>
    <!-- 内容 -->
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
  /**
   * @module App
   * @vue-component
   */

  /**
   * 引入主题切换组件
   * @component ThemeSwitch - 主题切换组件
   * @see {@link ./components/ThemeSwitch.vue}
   */
  import ThemeSwitch from "@/components/ThemeSwitch.vue";

  /**
   * 组件说明：
   * 1. 作为应用的根组件，提供基础布局结构
   * 2. 集成了主题切换功能，固定在右上角
   * 3. 通过 router-view 渲染路由匹配的组件
   *
   * @remarks
   * - 使用 position-fixed 确保主题切换按钮始终可见
   * - 使用 router-view 作为动态内容渲染区域
   */
</script>

<style lang="scss" scoped>
  /**
 * 组件样式
 * @note 当前组件暂无特定样式
 */
</style>
