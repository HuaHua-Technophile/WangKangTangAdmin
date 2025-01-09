/**
 * @fileoverview 定义与菜单相关的接口和类型，用于菜单管理模块的类型安全定义。
 * 包括菜单项（MenuItem）、菜单树项（MenuTreeItem）以及获取菜单列表参数（GetMenuListParams）的类型定义。
 */

/**
 * 菜单项接口
 * 表示一个菜单项的属性，包括目录、菜单、按钮等类型。
 */
export interface MenuItem {
  /**
   * 菜单ID（可选）
   * @type {number | undefined}
   */
  menuId?: number;

  /**
   * 菜单类型
   * "M" 表示目录, "C" 表示菜单, "F" 表示按钮
   * @type {"M" | "C" | "F"}
   */
  menuType: "M" | "C" | "F";

  /**
   * 排序号
   * 用于菜单排序
   * @type {number}
   */
  orderNum: number;

  /**
   * 父菜单ID
   * @type {number}
   */
  parentId: number;

  /**
   * 菜单可见性
   * "0" 表示显示, "1" 表示隐藏
   * @type {"0" | "1"}
   */
  visible: "0" | "1";

  // 以下是可选属性

  /**
   * 菜单名称（可选）
   * @type {string | undefined}
   */
  menuName?: string;

  /**
   * 菜单状态（可选）
   * @type {string | undefined}
   */
  status?: string;

  /**
   * 路由路径（可选）
   * @type {string | undefined}
   */
  path?: string;

  /**
   * 组件路径（可选）
   * @type {string | undefined}
   */
  component?: string;

  /**
   * 权限字符（可选）
   * @type {string | undefined}
   */
  perms?: string;

  /**
   * 是否为外链（可选）
   * "0" 表示是外链, "1" 表示否
   * @type {"0" | "1" | undefined}
   */
  isFrame?: "0" | "1";

  /**
   * 是否缓存（可选）
   * "0" 表示缓存, "1" 表示不缓存
   * @type {"0" | "1" | undefined}
   */
  isCache?: "0" | "1";

  /**
   * 图标名称（可选）
   * @type {string | undefined}
   */
  icon?: string;

  /**
   * 子菜单列表（可选）
   * 递归定义子菜单
   * @type {MenuItem[] | undefined}
   */
  children?: MenuItem[];

  /**
   * 创建时间（可选）
   * @type {string | undefined}
   */
  createTime?: string;

  /**
   * 更新时间（可选）
   * 可以为 null 表示未更新
   * @type {string | null | undefined}
   */
  updateTime?: string | null;
}

/**
 * 菜单树项接口
 * 表示一个菜单树节点的属性，用于构建菜单树结构。
 */
export interface MenuTreeItem {
  /**
   * 节点ID
   * @type {number}
   */
  id: number;

  /**
   * 节点标签（可选）
   * @type {string | undefined}
   */
  label?: string;

  /**
   * 节点值（可选）
   * @type {number | undefined}
   */
  value?: number;

  /**
   * 子节点列表（可选）
   * 递归定义子节点
   * @type {MenuTreeItem[] | undefined}
   */
  children?: MenuTreeItem[];
}

/**
 * 获取菜单列表参数类型
 * 从 MenuItem 类型中挑选 menuName 和 status 属性。
 */
export type GetMenuListParams = Pick<MenuItem, "menuName" | "status">;
