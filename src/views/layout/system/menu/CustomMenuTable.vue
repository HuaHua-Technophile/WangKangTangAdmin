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
            '--el-fill-color-light': themeStore.isDark ? '#353535' : '#EFEFF5',
            '--el-table-tr-bg-color': 'transparent',
          }
        : {
            '--el-fill-color-light': themeStore.isDark ? '#505050' : '#E3E3ED',
            '--el-table-tr-bg-color': 'transparent',
          }
    ">
    <slot />
  </el-table>
</template>
<script lang="ts" setup>
  import { useThemeStore } from "@/stores/theme"; // 引入主题状态管理

  /**
   * 组件接收的 props 定义。
   * @property {any[]} [data] - 表格数据，可选。
   * @property {number} [level=1] - 表格层级，默认为 1。
   */
  const props = withDefaults(defineProps<{ data?: any[]; level?: number }>(), {
    level: 1, // 默认值
  });

  /**
   * 主题状态管理，通过 Pinia 获取是否为暗黑模式。
   */
  const themeStore = useThemeStore();
</script>
