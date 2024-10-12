export interface MenuItem {
  menuId?: number;
  menuName: string;
  menuType: "M" | "C" | "F"; //M目录 C菜单  F按钮
  orderNum: number;
  parentId: number;
  visible: "0" | "1"; //0显示 1隐藏
  status: "0" | "1"; //0正常 1停用
  // 上面是必填项
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
  label: string;
  value: number;
  children?: MenuTreeItem[];
}
export interface GetMenuListParams {
  menuName?: string; // 可选参数
  status: "" | "0" | "1"; // 可选参数
}
