/**
 * @fileoverview 提供用于将平铺的树形数据格式化为树选择(TreeSelect)组件需要的格式的工具函数。
 * 支持设置根节点的标签、ID和值。
 */

import { TreeSelectItem, TreeSelectOptions } from "@/types/treeSelect";

/**
 * 将平铺的树形数据格式化为树选择(TreeSelect)组件需要的嵌套格式。
 *
 * @async
 * @function
 * @param {TreeSelectOptions} options - 配置选项，用于指定平铺数据以及根节点信息。
 * @param {Array} options.flat - 平铺的树形数据数组，每个元素包含节点的基本信息。
 * @param {string} [options.rootLabel="根节点"] - 根节点的显示标签。
 * @param {number} [options.rootId=0] - 根节点的ID。
 * @param {number} [options.rootValue=-1] - 根节点的值。
 * @returns {Promise<TreeSelectItem[]>} 返回一个Promise，解析为树选择组件所需的嵌套格式数据。
 * @example
 * const flatData = [
 *   { id: 1, name: "节点1", parentId: 0 },
 *   { id: 2, name: "节点2", parentId: 1 },
 *   { id: 3, name: "节点3", parentId: 1 }
 * ];
 *
 * formatTreeSelectByFlat({ flat: flatData }).then((result) => {
 *   console.log(result);
 * });
 */
export const formatTreeSelectByFlat = async ({
  flat,
  rootLabel = "根节点",
  rootId = 0,
  rootValue = -1,
}: TreeSelectOptions): Promise<TreeSelectItem[]> => {
  // 创建一个Map用于快速查找节点
  const nodeMap = new Map<number, TreeSelectItem>();

  // 遍历平铺数据，将每个节点添加到Map中
  for (const item of flat) {
    if (item.id !== undefined) {
      nodeMap.set(item.id, {
        id: item.id,
        label: item.label || item.name, // 使用label或者name作为节点的显示文本
        value: item.id, // 节点的值与其ID一致
        children: [], // 初始化子节点为空数组
      });
    }
  }

  // 存储最终的嵌套结构
  const result: TreeSelectItem[] = [];

  // 再次遍历平铺数据，构建父子关系
  for (const item of flat) {
    const currentNode = nodeMap.get(item.id!);
    if (currentNode) {
      if (item.parentId === rootId) {
        // 如果节点的父ID是根ID，则将其直接添加到结果数组中
        result.push(currentNode);
      } else if (item.parentId != undefined && nodeMap.has(item.parentId)) {
        // 如果节点有父节点且父节点存在于Map中，则将其添加为父节点的子节点
        const parentNode = nodeMap.get(item.parentId);
        parentNode?.children?.push(currentNode);
      }
    }
  }

  // 返回包含根节点的完整树结构
  return [{ id: rootId, label: rootLabel, value: rootValue, children: result }];
};
