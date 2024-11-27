import { DictDataItem } from "@/types/system/dict";

export const getLabelByDictData = (
  value: string | number,
  dictData: DictDataItem[]
) => {
  const item = dictData.find((dictItem) => dictItem.dictValue == value);
  return item ? item.dictLabel : value;
};
export const getTagTypeByDictData = (
  value: string | number,
  dictData: DictDataItem[]
) => {
  const item = dictData?.find((dictItem) => dictItem.dictValue == value);
  return item ? item.listClass : "info";
};
