import { defineStore } from "pinia";
import { ref } from "vue";
import { getDictDataByDictType } from "@/api/system/dict"; // 假设路径正确
import type { DictDataItem } from "@/types/system/dict";
import { debugLog } from "@/utils/debug";

export const useDictStore = defineStore("dict", () => {
  const dictData = ref<Record<string, DictDataItem[]>>({});

  const fetchDictData = async (...dictTypes: string[]) => {
    const requests = dictTypes.map((dictType) => {
      if (!dictData.value[dictType]) {
        return getDictDataByDictType(dictType).then((res) => {
          if (res.code === 200) {
            dictData.value[dictType] = res.data;
            debugLog(dictType, res.data);
          }
        });
      }
    });

    await Promise.all(requests);
  };

  return {
    dictData,
    fetchDictData,
  };
});
