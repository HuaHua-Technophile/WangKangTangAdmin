<!-- 
  文件名称: TooltipFormItem.vue
  功能描述: 
    - 一个封装了 Element Plus 表单项 (el-form-item) 的 Vue 组件。
    - 支持通过 prop 和 label 定义表单字段和标签。
    - 提供一个可选的 tip 属性，用于显示提示信息，带有工具提示功能。
    - 支持插槽，用于自定义表单项的内容。
  使用场景:
    - 在表单中需要带有提示信息的表单项时使用。
  作者: [您的名字]
  创建日期: [创建日期]
-->

<template>
  <!-- 
    el-form-item: Element Plus 提供的表单项组件，用于布局和验证表单字段。
    prop: 表单字段对应的属性，用于表单验证。
    label: 表单项的标签。
    slot: 用于自定义表单项内容。
  -->
  <el-form-item :prop="prop" :label="label">
    <!-- 如果提供了 tip 属性，则显示带工具提示的标签 -->
    <template #label v-if="tip">
      <!-- 
        el-tooltip: Element Plus 提供的工具提示组件。
        effect: 工具提示的主题样式，'light' 表示浅色主题。
        content: 工具提示中显示的文本内容。
      -->
      <el-tooltip effect="light" :content="tip">
        <!-- 
          Icon: 自定义的图标组件，用于显示提示图标。
          class: 添加样式类，用于控制图标的外观。
        -->
        <Icon icon="icon-wenhao" class="me-1 opacity-50" />
      </el-tooltip>
      {{ label }}
    </template>
    <!-- 默认插槽，用于放置自定义内容 -->
    <slot />
  </el-form-item>
</template>

<script setup lang="ts">
  import { defineProps } from "vue";

  /**
   * 表单项组件的属性定义。
   */
  const { prop, tip, label } = defineProps<{
    /**
     * 表单字段属性名，用于表单验证。
     * @type {string}
     */
    prop: string;

    /**
     * 表单项的标签文本。
     * @type {string}
     */
    label: string;

    /**
     * (可选) 提示信息，用于显示在工具提示中。
     * @type {string | undefined}
     */
    tip?: string;
  }>();
</script>
