import { CategoryItem } from "@/types/product/category";

export const formatCategoryTreeByFlat = async (
  flat: CategoryItem[]
): Promise<CategoryItem[]> => {
  const nodeMap = new Map<number, CategoryItem>();

  // 第一次遍历：创建节点映射
  for (const item of flat) {
    nodeMap.set(item.id!, {
      ...item,
      children: [],
    });
  }

  const result: CategoryItem[] = [];

  // 第二次遍历：构建树形结构
  for (const item of flat) {
    const currentNode = nodeMap.get(item.id!);

    if (currentNode) {
      // 情况1：父ID为1的节点，直接作为根节点
      if (item.parentId === 1) {
        result.push(currentNode);
      }
      // 情况2：有父节点且父节点存在于nodeMap中，则添加到对应父节点的children中
      else if (
        item.parentId !== undefined &&
        item.parentId !== 0 &&
        item.parentId !== 1 &&
        nodeMap.has(item.parentId)
      ) {
        const parentNode = nodeMap.get(item.parentId);
        parentNode?.children?.push(currentNode);
      }
      // 情况3：真正的根节点（parentId为0或undefined）且不是ID为1的节点
      else if (
        (item.parentId === undefined || item.parentId === 0) &&
        item.id !== 1
      )
        result.push(currentNode);
      // 新增情况4：处理孤立节点（父节点不在当前数据集中）
      else if (!nodeMap.has(item.parentId!) && item.id !== 1)
        result.push(currentNode);
    }
  }

  return result;
};
