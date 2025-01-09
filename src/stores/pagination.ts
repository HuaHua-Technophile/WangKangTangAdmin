/**
 * @file usePaginationStore.ts
 * @description 这是一个使用 Pinia 定义的分页存储模块，用于管理分页相关的状态数据。
 * 它支持持久化功能，确保状态在页面刷新后仍然保持。
 * @author [您的名字]
 * @date [日期，例如 2023-10-05]
 */

import { defineStore } from "pinia";
import { ref } from "vue";

/**
 * @property {import("vue").Ref<number>} pageSize - 每页的项目数量。
 */

/**
 * @function usePaginationStore
 * @description 定义一个 Pinia 的分页存储模块，用于管理分页状态。
 * @returns {PaginationStore} 返回包含分页相关状态的对象。
 */
export const usePaginationStore = defineStore(
  "pagination",
  () => {
    /**
     * @description 每页的项目数量，默认值为 11。
     */
    const pageSize = ref(11);

    return {
      pageSize,
    };
  },
  {
    /**
     * @property {boolean} persist - 是否开启持久化存储。
     */
    persist: true, // 启用持久化
  }
);
