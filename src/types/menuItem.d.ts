export interface MenuItem {
  createTime: string;
  updateTime: string | null;
  menuId: number;
  menuName: string;
  parentName: string | null;
  parentId: number;
  orderNum: number;
  path: string;
  component: string | null;
  query: string;
  routeName: string;
  isFrame: string; //是否为外链（0是 1否）
  isCache: string; //0缓存 1不缓存
  menuType: string; //M目录 C菜单  F按钮
  visible: string; //0显示 1隐藏
  status: string; //0正常 1停用
  perms: string;
  icon: string;
  children: MenuItem[]; // 递归定义子菜单
}
