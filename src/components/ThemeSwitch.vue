<template>
  <el-switch
    :size="'large'"
    :model-value="isDark"
    @update:model-value="toggleTheme"
    inline-prompt>
    <template #active-action><Icon icon="icon-moon" /></template>
    <template #inactive-action><Icon icon="icon-taiyang" /></template>
  </el-switch>
</template>

<script setup lang="ts">
  import { storeToRefs } from "pinia";
  import { useThemeStore } from "@/stores/theme";
  import { onMounted } from "vue";

  const themeStore = useThemeStore();
  const { isDark } = storeToRefs(themeStore);
  const { toggleTheme, updateHtmlClass } = themeStore;

  onMounted(() => {
    updateHtmlClass();
  });
</script>
