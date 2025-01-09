<!--
  文件名：MyDialogComponent.vue
  描述：这是一个可复用的弹窗组件，基于 Element Plus 的 el-dialog 组件进行封装，支持标题、宽度自定义以及关闭确认功能。
  作者：请填入作者名称
  创建日期：请填入创建日期
-->

<template>
  <el-dialog
    v-model="A_EVisible"
    :title="A_ETitle"
    :width="width"
    :before-close="closeConfirmFun"
    class="rounded-4 pb-0 overflow-hidden"
    draggable
    center>
    <!-- 具名插槽 -->
    <template #header>
      <el-button @click="submitForm()"
        >确认{{ A_ETitle }}<slot name="headerBtn" />
      </el-button>
    </template>
    <!-- 默认插槽 -->
    <slot />
  </el-dialog>
</template>

<script lang="ts" setup>
  /**
   * 引入封装的消息确认工具函数
   * @function elMessageBoxConfirm - 用于显示确认消息框
   */
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm";

  /**
   * 模型绑定：弹窗的可见性
   * @model A_EVisible - 控制弹窗的显示与隐藏
   */
  const A_EVisible = defineModel<boolean>("A_EVisible");

  /**
   * 组件的 Props 定义
   * @property {string} A_ETitle - 弹窗标题
   * @property {Function} submitForm - 确认按钮的回调函数
   * @property {string} [width="590px"] - 弹窗宽度，默认值为 590px
   */
  const props = withDefaults(
    defineProps<{
      A_ETitle: string;
      submitForm: () => void;
      width?: string;
    }>(),
    {
      width: "590px",
    }
  );

  /**
   * 关闭弹窗前的确认逻辑
   * @function closeConfirmFun
   * @param {Function} done - 关闭弹窗的回调函数
   */
  const closeConfirmFun = (done: () => void) => {
    elMessageBoxConfirm(`放弃${props.A_ETitle}`, () => {
      done();
    });
  };
</script>
