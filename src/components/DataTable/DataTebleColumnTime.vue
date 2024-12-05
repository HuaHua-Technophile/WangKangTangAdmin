<template>
  <el-table-column label="更新时间">
    <template #default="{ row }">
      <!-- effect="light/dark"是反过来的  -->
      <el-tooltip effect="light" placement="left">
        <template #content>
          创建者:
          {{ row.createBy || "无" }} | 时间:
          {{ formatToReadableDate(row.createTime) }}<br />
          更新者:
          {{ row.createBy || "无" }} | 时间:
          {{ formatToReadableDate(row.updateTime) }}
        </template>
        <div>
          {{ formatToReadableDate(row.updateTime || row.createTime, true) }}
        </div>
      </el-tooltip>
    </template>
  </el-table-column>
</template>
<script lang="ts" setup>
  import { formatToReadableDate } from "@/utils/formatToReadableDate";
</script>
