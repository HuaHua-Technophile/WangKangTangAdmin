<!-- 文件级别注释 -->
<!--
  @file Pagination.vue
  @description 这是一个基于 Element Plus 的分页组件，支持自定义页码大小和当前页码的变化。
  @author
  @date 2023-10
  @version 1.0.0
-->

<template>
  <el-pagination
    background
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :total="total"
    :page-sizes="[8, 9, 10, 11, 12, 13, 14, 15, 20, 30, 40, 50]"
    layout="prev, pager, next, jumper,->,sizes,total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange" />
</template>

<script lang="ts" setup>
  /**
   * 引入分页状态管理的 Pinia store
   */
  import { usePaginationStore } from "@/stores/pagination";
  import { storeToRefs } from "pinia";

  /**
   * 当前页码，使用 defineModel 绑定到父组件的值
   */
  const currentPage = defineModel<number>("currentPage");

  /**
   * 数据总数，使用 defineModel 绑定到父组件的值
   */
  const total = defineModel<number>("total");

  /**
   * 事件发射器，定义了支持的两个事件：size-change 和 current-change
   */
  const emit = defineEmits<{
    /**
     * 页码大小变化事件
     */
    "size-change": [];
    /**
     * 当前页码变化事件
     */
    "current-change": [];
  }>();

  /**
   * 从 Pinia store 中获取 pageSize 响应式状态
   */
  const { pageSize } = storeToRefs(usePaginationStore());

  /**
   * 处理页码大小变化的回调函数
   * 向父组件发射 size-change 事件
   */
  const handleSizeChange = (): void => {
    emit("size-change");
  };

  /**
   * 处理当前页码变化的回调函数
   * 向父组件发射 current-change 事件
   */
  const handleCurrentChange = (): void => {
    emit("current-change");
  };
</script>
