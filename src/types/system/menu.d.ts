export interface MenuItem {
  menuId?: number;
  menuType: "M" | "C" | "F"; //M目录 C菜单 F按钮
  orderNum: number;
  parentId: number;
  visible: "0" | "1"; //0显示 1隐藏

  // 上面是必填项
  menuName?: string;
  status?: string;
  path?: string;
  component?: string;
  perms?: string; // 权限字符
  isFrame?: "0" | "1"; //是否为外链（0是 1否）
  isCache?: "0" | "1"; //0缓存 1不缓存
  icon?: string;
  children?: MenuItem[]; // 递归定义子菜单
  createTime?: string;
  updateTime?: string | null;
}
export interface MenuTreeItem {
  id: number;
  label?: string;
  value?: number;
  children?: MenuTreeItem[];
}
export type GetMenuListParams = Pick<MenuItem, "menuName" | "status">;
