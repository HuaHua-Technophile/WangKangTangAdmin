/**
 * @fileOverview 树形选择器数据格式化工具
 * @module TreeSelectFormatter
 * @description 提供将树形数据转换为TreeSelect组件所需格式的工具函数
 * @requires @/types/treeSelect
 */

import { TreeSelectItem, TreeSelectOptions } from "@/types/treeSelect";

/**
 * 将树形数据格式化为TreeSelect组件所需的嵌套结构
 *
 * @param {TreeSelectOptions} [options={}] - 格式化配置选项
 * @param {TreeSelectItem[]} [options.flat=[]] - 待转换的原始树形数据
 * @param {string} [options.rootLabel="根节点"] - 根节点标签
 * @param {number} [options.rootId=0] - 根节点ID
 * @param {number} [options.rootValue=0] - 根节点值
 *
 * @returns {Promise<TreeSelectItem[]>} 格式化后的树形选择器数据
 *
 * @example
 * // 将普通树形结构转换为TreeSelect所需格式
 * formatTreeSelectByTree({ flat: originalTree })
 *   .then(formattedTree => {
 *     // 使用转换后的树形数据
 *   });
 */
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

/**
 * 递归格式化子节点
 *
 * @param {TreeSelectItem[]} [children=[]] - 子节点数组
 * @returns {TreeSelectItem[]} 格式化后的子节点数组
 *
 * @private
 * @description 递归处理树形结构的子节点，确保每个节点具有label、id、value和children属性
 */
const formatChildren = (children: TreeSelectItem[] = []): TreeSelectItem[] => {
  return children.map((child) => ({
    label: child.label,
    id: child.id,
    value: child.id,
    children: formatChildren(child.children),
  }));
};
