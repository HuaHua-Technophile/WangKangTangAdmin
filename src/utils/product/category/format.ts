/**
 * @fileoverview 提供一个函数，用于将扁平化的类别数据转换为树形结构。
 * 该函数支持处理多种情况，包括孤立节点和根节点的特殊处理。
 * @module utils/formatCategoryTree
 */

import { CategoryItem } from "@/types/product/category";

/**
 * 将扁平化的类别数据转换为树形结构。
 *
 * @async
 * @param {CategoryItem[]} flat - 扁平化的类别数据数组。
 *   每个类别项应包含 `id` 和 `parentId` 字段，`children` 字段会在返回的树形结构中被填充。
 * @returns {Promise<CategoryItem[]>} 返回一个 Promise，解析为树形结构的类别数据数组。
 *   根节点会根据 `parentId` 的值为 0、undefined 或 1 的规则进行处理。
 *
 * @example
 * const flatData = [
 *   { id: 1, parentId: 0, name: "Root" },
 *   { id: 2, parentId: 1, name: "Child 1" },
 *   { id: 3, parentId: 1, name: "Child 2" },
 *   { id: 4, parentId: 2, name: "Sub-child 1" },
 * ];
 * const treeData = await formatCategoryTreeByFlat(flatData);
 * console.log(treeData);
 */
export const formatCategoryTreeByFlat = async (
  flat: CategoryItem[]
): Promise<CategoryItem[]> => {
  // 创建一个 Map 用于存储每个节点的引用，key 为节点的 ID。
  const nodeMap = new Map<number, CategoryItem>();

  /**
   * 第一次遍历：创建节点映射。
   * 将每个节点存储到 nodeMap 中，并初始化其 `children` 属性为空数组。
   */
  for (const item of flat) {
    nodeMap.set(item.id!, {
      ...item,
      children: [],
    });
  }

  // 初始化结果数组，用于存储最终的树形结构。
  const result: CategoryItem[] = [];

  /**
   * 第二次遍历：构建树形结构。
   * 遍历扁平化数据，根据 `parentId` 将子节点挂载到对应的父节点上。
   */
  for (const item of flat) {
    const currentNode = nodeMap.get(item.id!);

    if (currentNode) {
      // 情况1：`parentId` 为 1 的节点，直接作为根节点。
      if (item.parentId === 1) {
        result.push(currentNode);
      }
      // 情况2：有父节点且父节点存在于 nodeMap 中，则添加到对应父节点的 `children` 中。
      else if (
        item.parentId !== undefined &&
        item.parentId !== 0 &&
        item.parentId !== 1 &&
        nodeMap.has(item.parentId)
      ) {
        const parentNode = nodeMap.get(item.parentId);
        parentNode?.children?.push(currentNode);
      }
      // 情况3：真正的根节点（`parentId` 为 0 或 undefined）且不是 ID 为 1 的节点。
      else if (
        (item.parentId === undefined || item.parentId === 0) &&
        item.id !== 1
      ) {
        result.push(currentNode);
      }
      // 情况4：处理孤立节点（父节点不在当前数据集中）。
      else if (!nodeMap.has(item.parentId!) && item.id !== 1) {
        result.push(currentNode);
      }
    }
  }

  return result;
};
