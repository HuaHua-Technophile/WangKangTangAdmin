<template>
  <el-table
    :data="props.data"
    table-layout="auto"
    cell-class-name="text-center"
    :header-row-class-name="
      props.level == 1
        ? ''
        : props.level == 2
        ? 'bg-primary bg-opacity-75'
        : 'bg-success bg-opacity-75'
    "
    :header-cell-class-name="
      themeStore.isDark
        ? 'text-center bg-transparent'
        : 'text-center bg-transparent text-dark'
    "
    :class="
      props.level == 1
        ? ''
        : props.level == 2
        ? 'bg-body-tertiary border border-3 border-primary border-opacity-75'
        : 'bg-body-secondary'
    "
    class="w-100 rounded-3"
    :style="
      props.level == 1
        ? {}
        : props.level == 2
        ? {
            '--el-fill-color-light': ' #353535',
            '--el-table-tr-bg-color': ' transparent',
          }
        : { '--el-fill-color-light': ' #505050' }
    ">
    <slot />
    <MenuTableItem />
  </el-table>
</template>
<script lang="ts" setup>
  import { useThemeStore } from "@/stores/theme";
  import MenuTableItem from "@/views/layout/system/menu/MenuTableItem.vue";
  const props = withDefaults(defineProps<{ data?: any[]; level?: number }>(), {
    level: 1,
  });

  const themeStore = useThemeStore();
</script>
