/**
 * @fileoverview 定义与菜单管理相关的API请求方法。
 * 通过封装的 `customRequest` 方法实现对菜单的增删改查操作。
 * 包括添加菜单、修改菜单、删除菜单、获取菜单列表以及获取菜单树结构。
 */

import { customRequest } from "@/api/instance"; // 引入之前封装的请求方法
import { GetMenuListParams, MenuItem, MenuTreeItem } from "@/types/system/menu";

/**
 * 添加菜单
 * 发送 POST 请求以添加一个新的菜单项。
 * @param {MenuItem} data - 菜单项的数据
 */
export const addMenu = (data: MenuItem) => {
  return customRequest(
    {
      method: "POST", // 请求方法
      url: "/system/menu", // API 路径
      data, // 将参数传递给请求
    },
    "添加菜单"
  );
};

/**
 * 修改菜单
 * 发送 PUT 请求以修改指定的菜单项。
 * @param {MenuItem} data - 菜单项的数据
 */
export const editMenu = (data: MenuItem) => {
  return customRequest(
    {
      method: "PUT", // 请求方法
      url: "/system/menu", // API 路径
      data, // 将参数传递给请求
    },
    "修改菜单"
  );
};

/**
 * 删除菜单
 * 发送 DELETE 请求以删除指定的菜单项。
 * @param {number} menuId - 要删除的菜单项的 ID
 */
export const delMenu = (menuId: number) => {
  return customRequest(
    {
      method: "DELETE", // 使用 DELETE 方法
      url: `/system/menu/${menuId}`, // API 路径
    },
    `删除菜单`
  );
};

/**
 * 获取菜单列表
 * 发送 GET 请求以获取菜单列表。
 * @param {GetMenuListParams} params - 请求参数，包括菜单名称和状态
 */
export const getMenuList = (params: GetMenuListParams) => {
  return customRequest<MenuItem[]>(
    {
      method: "get", // 请求方法
      url: "/system/menu/list", // API 路径
      params, // 将参数传递给请求
    },
    "获取菜单列表"
  );
};

/**
 * 获取菜单树选择列表
 * 发送 GET 请求以获取菜单的树形结构，用于下拉选择。
 */
export const getMenuTreeSelect = () => {
  return customRequest<MenuTreeItem[]>(
    {
      method: "get", // 请求方法
      url: "/system/menu/treeselect", // API 路径
      params: {
        menuName: undefined,
        menuType: undefined,
        orderNum: undefined,
      }, // 将参数传递给请求
    },
    "获取下拉树菜单列表"
  );
};
