<!--
  文件名称: UpdateTimeColumn.vue
  功能描述: 该组件是一个包含更新时间和创建时间的表格列组件，使用Element Plus的el-table-column和el-tooltip。
  作者: [您的姓名或团队名称]
  创建日期: [创建日期]
  修改日期: [最后修改日期]
  依赖项: 
    - Element Plus: 用于表格列和工具提示组件
    - formatToReadableDate: 用于格式化时间的工具函数
-->

<template>
  <!-- 表格列，用于显示更新时间 -->
  <el-table-column label="更新时间">
    <template #default="{ row }">
      <!-- 工具提示，显示详细的创建者和更新者信息 -->
      <el-tooltip effect="light" placement="left">
        <template #content>
          <!-- 提示内容，显示创建者和更新者的详细信息 -->
          创建者:
          {{ row.createBy || "无" }} | 时间:
          {{ formatToReadableDate(row.createTime) }}<br />
          更新者:
          {{ row.updateBy || "无" }} | 时间:
          {{ formatToReadableDate(row.updateTime) }}
        </template>
        <!-- 工具提示触发元素，显示更新时间或创建时间的简化格式 -->
        <div>
          {{ formatToReadableDate(row.updateTime || row.createTime, true) }}
        </div>
      </el-tooltip>
    </template>
  </el-table-column>
</template>

<script lang="ts" setup>
  /**
   * 导入formatToReadableDate工具函数
   * @function formatToReadableDate
   * @param {string | Date} date - 需要格式化的日期
   * @param {boolean} [short=false] - 是否使用简短格式
   * @returns {string} 返回格式化后的日期字符串
   */
  import { formatToReadableDate } from "@/utils/formatToReadableDate";
</script>
