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
  import { usePaginationStore } from "@/stores/pagination";
  import { storeToRefs } from "pinia";

  const currentPage = defineModel<number>("currentPage");
  const total = defineModel<number>("total");

  const emit = defineEmits<{
    "size-change": [];
    "current-change": [];
  }>();

  const { pageSize } = storeToRefs(usePaginationStore());

  const handleSizeChange = () => {
    emit("size-change");
  };

  const handleCurrentChange = () => {
    emit("current-change");
  };
</script>
