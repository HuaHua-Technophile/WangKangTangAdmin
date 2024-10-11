<template>
  <el-table-column label="更新时间">
    <template #default="scope">
      <!-- effect="light/dark"是反过来的  -->
      <el-tooltip effect="light" placement="left">
        <template #content>
          更新: {{ formatToReadableDate(scope.row.updateTime) }} <br />
          创建: {{ formatToReadableDate(scope.row.createTime) }}
        </template>
        <div>
          {{
            formatToReadableDate(
              scope.row.updateTime || scope.row.createTime,
              true
            )
          }}
        </div>
      </el-tooltip>
    </template>
  </el-table-column>
</template>
<script lang="ts" setup>
  import { formatToReadableDate } from "@/utils/formatToReadableDate";
</script>
