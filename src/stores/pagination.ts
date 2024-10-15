import { defineStore } from "pinia";
import { ref } from "vue";

export const usePaginationStore = defineStore(
  "pagination",
  () => {
    const pageSize = ref(11);
    return {
      pageSize,
    };
  },
  {
    persist: true, // 启用持久化
  }
);
