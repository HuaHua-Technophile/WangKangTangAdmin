import { TreeSelectItem, TreeSelectOptions } from "@/types/treeSelect";

export const formatTreeSelectByTree = (
  {
    flat: Tree,
    rootLabel = "根节点",
    rootId = 0,
    rootValue = 0,
  }: TreeSelectOptions = { flat: [] }
) => {
  return Promise.resolve([
    {
      label: rootLabel,
      id: rootId,
      value: rootValue,
      children: Tree.map((item) => ({
        label: item.label,
        id: item.id,
        value: item.id,
        children: formatChildren(item.children),
      })),
    },
  ]);
};

// 辅助函数：格式化子节点
const formatChildren = (children: TreeSelectItem[] = []): TreeSelectItem[] => {
  return children.map((child) => ({
    label: child.label,
    id: child.id,
    value: child.id,
    children: formatChildren(child.children),
  }));
};
