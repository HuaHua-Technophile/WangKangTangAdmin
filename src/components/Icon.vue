<!-- 
  文件名: Icon.vue
  描述: 通用图标组件，支持动态设置图标名称、大小和颜色。
  作者: [您的姓名/团队]
  日期: [创建日期]
  注意: 依赖于 iconfont 字体库，请确保项目中已正确引入 iconfont 样式文件。
-->

<template>
  <i
    :class="[
      'iconfont d-flex align-items-center justify-content-center ',
      iconClass,
    ]"
    :style="style"></i>
</template>

<script lang="ts" setup>
  /**
   * 导入 Vue 的响应式 API。
   */
  import { computed } from "vue";

  /**
   * Props 接口定义。
   * @property {string} icon - 图标的名称，支持自动添加 'icon-' 前缀。
   * @property {string | number} [size="16px"] - 图标的大小，可以是像素值或其他 CSS 支持的单位。
   * @property {string} [color="inherit"] - 图标的颜色，默认为继承父级颜色。
   */
  interface Props {
    icon: string;
    size?: string | number;
    color?: string;
  }

  /**
   * 定义组件的默认属性值。
   */
  const props = withDefaults(defineProps<Props>(), {
    size: "16px",
    color: "inherit",
  });

  /**
   * 计算图标的类名。
   * 如果 `icon` 属性未包含 'icon-' 前缀，则自动添加。
   * @returns {string} 完整的图标类名。
   */
  const iconClass = computed(() => {
    return props.icon?.startsWith("icon-") ? props.icon : `icon-${props.icon}`;
  });

  /**
   * 计算图标的样式。
   * 动态设置图标的字体大小和颜色。
   * @returns {object} 包含 `fontSize` 和 `color` 的样式对象。
   */
  const style = computed(() => ({
    fontSize: typeof props.size === "number" ? `${props.size}px` : props.size,
    color: props.color,
  }));
</script>
