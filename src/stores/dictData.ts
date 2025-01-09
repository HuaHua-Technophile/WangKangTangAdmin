/**
 * @fileoverview Pinia Store 用于管理字典数据的状态和操作。
 * 包括从后端获取字典数据并缓存到前端，以减少重复请求。
 *
 * @module stores/dictData
 */

import { defineStore } from "pinia";
import { ref } from "vue";
import { getDictDataByDictType } from "@/api/system/dict"; // 假设路径正确
import type { DictDataItem } from "@/types/system/dict";
import { debugLog } from "@/utils/debug";

/**
 * 使用 Pinia 定义的字典数据存储。
 *
 * @function useDictStore
 * @returns {Object} 包含字典数据和获取字典数据的方法。
 */
export const useDictStore = defineStore("dict", () => {
  /**
   * 字典数据，键为字典类型，值为对应的字典项列表。
   */
  const dictData = ref<Record<string, DictDataItem[]>>({});

  /**
   * 根据字典类型获取字典数据，并缓存到 `dictData` 中。
   * 如果某个字典类型的数据已经存在，则不会重复请求。
   *
   * @async
   * @function fetchDictData
   * @param {...string} dictTypes - 要获取数据的字典类型列表。
   * @returns {Promise<void>} 返回一个 Promise，表示所有字典数据已加载完成。
   */
  const fetchDictData = async (...dictTypes: string[]): Promise<void> => {
    const requests = dictTypes.map((dictType) => {
      // 如果字典数据尚未加载，则发起请求
      if (!dictData.value[dictType]) {
        return getDictDataByDictType(dictType).then((res) => {
          if (res.code === 200) {
            // 将获取到的数据存储到 dictData 中
            dictData.value[dictType] = res.data;
            debugLog(dictType, res.data); // 调试日志
          }
        });
      }
    });

    // 等待所有请求完成
    await Promise.all(requests);
  };

  return {
    dictData,
    fetchDictData,
  };
});
