export interface UserItem {
  userId?: number;
  admin?: boolean; //是否管理员
  avatar?: string; //头像
  createTime?: string; //创建时间
  updateTime?: string; //创建时间
  userName: string;
  nickName: string;
  email: string;
  phonenumber: string;
  sex: "0" | "1"; //性别：0-女，1-男
  roles?: {
    roleId: number;
    roleName: string;
  }[]; //所拥有的角色
  loginIp?: string;
  loginDate?: string;
  status?: "0" | "1" | ""; //状态：0-正常，1-停用
}
// 扩展 UserItem 接口
export interface UserFormData extends UserItem {
  password?: string;
  confirmPassword?: string;
}
