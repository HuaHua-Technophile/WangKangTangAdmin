<!-- src/components/Icon.vue -->
<template>
  <i
    :class="[
      'iconfont d-flex align-items-center justify-content-center ',
      iconClass,
    ]"
    :style="style"></i>
</template>

<script lang="ts" setup>
  import { computed } from "vue";

  interface Props {
    icon: string;
    size?: string | number;
    color?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    size: "16px",
    color: "inherit",
  });
  const iconClass = computed(() => {
    // 检查 name 是否已经包含 'icon-' 前缀
    return props.icon?.startsWith("icon-") ? props.icon : `icon-${props.icon}`;
  });
  const style = computed(() => ({
    fontSize: typeof props.size === "number" ? `${props.size}px` : props.size,
    color: props.color,
  }));
</script>
