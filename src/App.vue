<template>
  <div>
    <div class="position-fixed top-0 end-0 px-2">
      <ThemeSwitch />
    </div>
    <router-view></router-view>
  </div>
</template>
<script setup lang="ts">
  import ThemeSwitch from "@/components/ThemeSwitch.vue";
</script>
<style lang="scss" scoped></style>
