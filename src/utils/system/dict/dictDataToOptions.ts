/**
 * @file utils/dictDataUtils.ts
 * @description 提供与字典数据相关的实用函数，用于根据字典值获取标签或类型。
 * @author [您的姓名]
 * @date [日期]
 */

import { DictDataItem } from "@/types/system/dict";

/**
 * 根据字典值获取对应的标签
 *
 * @param {string | number} value - 字典项的值，用于匹配字典数据中的 `dictValue`。
 * @param {DictDataItem[]} dictData - 字典数据数组，每个字典项包含 `dictValue` 和 `dictLabel`。
 * @returns {string | number} - 返回匹配字典项的标签 (`dictLabel`)，如果未找到，则返回原始值。
 *
 * @example
 * const dictData = [
 *   { dictValue: 1, dictLabel: "启用" },
 *   { dictValue: 0, dictLabel: "禁用" }
 * ];
 * getLabelByDictData(1, dictData); // 返回 "启用"
 * getLabelByDictData(2, dictData); // 返回 2
 */
export const getLabelByDictData = (
  value: string | number,
  dictData: DictDataItem[]
): string | number => {
  const item = dictData?.find((dictItem) => dictItem.dictValue == value);
  return item?.dictLabel ?? value; // 使用可选链和空值合并操作符处理 undefined。
};

/**
 * 根据字典值获取对应的标签类型（主要用于UI展示）
 *
 * @param {string | number} value - 字典项的值，用于匹配字典数据中的 `dictValue`。
 * @param {DictDataItem[]} dictData - 字典数据数组，每个字典项包含 `dictValue` 和 `listClass`。
 * @returns {string} - 返回匹配字典项的类型 (`listClass`)，如果未找到，则返回默认值 "info"。
 *
 * @example
 * const dictData = [
 *   { dictValue: 1, listClass: "success" },
 *   { dictValue: 0, listClass: "danger" }
 * ];
 * getTagTypeByDictData(1, dictData); // 返回 "success"
 * getTagTypeByDictData(2, dictData); // 返回 "info"
 */
export const getTagTypeByDictData = (
  value: string | number,
  dictData: DictDataItem[]
): string => {
  const item = dictData?.find((dictItem) => dictItem.dictValue == value);
  return item?.listClass ?? "info"; // 使用可选链和空值合并操作符处理 undefined。
};
