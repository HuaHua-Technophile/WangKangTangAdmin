import { TreeSelectItem, TreeSelectOptions } from "@/types/treeSelect";

export const formatTreeSelectByFlat = async ({
  flat,
  rootLabel = "根节点",
  rootId = 0,
  rootValue = -1,
}: TreeSelectOptions): Promise<TreeSelectItem[]> => {
  const nodeMap = new Map<number, TreeSelectItem>();
  for (const item of flat) {
    if (item.id !== undefined) {
      nodeMap.set(item.id, {
        id: item.id,
        label: item.label || item.name,
        value: item.id,
        children: [],
      });
    }
  }

  const result: TreeSelectItem[] = [];

  for (const item of flat) {
    const currentNode = nodeMap.get(item.id!);
    if (currentNode) {
      if (item.parentId === rootId) result.push(currentNode);
      else if (item.parentId != undefined && nodeMap.has(item.parentId)) {
        const parentNode = nodeMap.get(item.parentId);
        parentNode?.children?.push(currentNode);
      }
    }
  }

  return result.length > 0
    ? [{ id: rootId, label: rootLabel, value: rootValue, children: result }]
    : [];
};
