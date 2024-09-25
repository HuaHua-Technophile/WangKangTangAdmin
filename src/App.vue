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
  import ThemeSwitch from "@/components/ThemeSwitch.vue";
</script>
<style lang="scss" scoped></style>
