import { PaginationParams } from "@/types/pagination";

export interface RoleItem {
  roleKey?: string;
  roleName?: string;
  status?: string;
  roleId?: number;
  roleSort?: number;
  admin?: boolean;
  menuIds?: number[];
  // dataScope: "1" | "2" | "3" | "4"; //数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）
}
export type GetRoleListParams = PaginationParams &
  Pick<RoleItem, "roleName" | "roleKey" | "status">;
