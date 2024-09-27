import { customRequest } from "@/api/instance"; // 引入之前封装的请求方法

// 定义接口请求的参数类型
interface GetMenuListParams {
  menuName?: string; // 可选参数
  menuType?: string; // 可选参数
  orderNum?: number; // 可选参数
}

interface MenuItem {
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
  isFrame: string;
  isCache: string;
  menuType: string;
  visible: string;
  status: string;
  perms: string;
  icon: string;
  children: MenuItem[]; // 递归定义子菜单
}

// 封装获取菜单列表的请求方法
export const getMenuList = (params: GetMenuListParams) => {
  return customRequest<MenuItem[]>(
    {
      method: "get", // 请求方法
      url: "/system/menu/list", // API 路径
      params, // 将参数传递给请求
    },
    "获取菜单列表"
  ); // 调用二次封装的请求方法
};
