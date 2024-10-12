export interface GetRoleListParams {
  roleKey?: string;
  roleName?: string;
  status: "0" | "1" | "";
  pageNum?: number;
  pageSize?: number;
}

export interface RoleItem extends GetRoleListParams {
  roleId?: number;
  roleSort?: number;
  admin?: boolean;
  menuIds?: number[];
  createTime?: string;
  updateTime?: string;
  // dataScope: "1" | "2" | "3" | "4"; //数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）
}
