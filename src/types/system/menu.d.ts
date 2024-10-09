export interface MenuItem {
  createTime?: string;
  updateTime?: string | null;
  menuId?: number;
  menuName: string;
  parentName?: string | null;
  parentId: number;
  orderNum: number;
  path: string;
  component: string | null;
  query?: string;
  routeName: string;
  isFrame: "0" | "1"; //是否为外链（0是 1否）
  isCache: "0" | "1"; //0缓存 1不缓存
  menuType: "M" | "C" | "F"; //M目录 C菜单  F按钮
  visible: "0" | "1"; //0显示 1隐藏
  status: "0" | "1"; //0正常 1停用
  perms?: string;
  icon: string;
  children?: MenuItem[]; // 递归定义子菜单
}
export interface MenuTreeItem {
  id: number;
  label: string;
  value: number;
  children?: MenuTreeItem[];
}
export interface GetMenuListParams {
  menuName?: string; // 可选参数
  menuType: "" | "M" | "C" | "F"; //M目录 C菜单  F按钮;
  orderNum?: number; // 可选参数
}
