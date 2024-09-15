/**
 * @description 获取员工列表 /admin/list
 */
export interface IGetStaffListReq {
  name: string; // 员工名称
  phone: string; // 手机号码
}
export interface IGetStaffListRes {
  totalNum: number;
  list: IStaffList[];
}
export interface IStaffList {
  id: number; // 员工ID
  name: string; // 员工名称
  nick: string; // 员工昵称
  phone: string; // 手机号码
  registerTime: string; // 注册时间
}

/**
 * @description 查询员工详细信息（包括权限） /admin/info
 */
export interface IGetStaffInfoReq {
  adminId: number; // 员工ID
}
export interface IGetStaffInfoRes {
  id: number; // 员工ID
  name: string; // 员工名称
  loginName: string; // 员工登录名称
  phone: string; // 员工手机号码
  password: string; // 员工登录密码
  menuInfoList: string[];
}
export interface IStaffMenuList {
  id: number; // 菜单ID
  name: string; // 菜单名称
  isHave: boolean; // 是否拥有此菜单
  subMenuList?: IStaffMenuList[]; // 下级菜单
}

/**
 * @description 保存员工信息 /admin/save
 */
export interface ISaveStaffInfoReq {
  id?: number; // 员工ID
  name: string; // 员工名称
  loginName: string; // 员工登录名称
  password: string; // 员工登录密码
  phone: string; // 员工手机号码
  email?: string; // 员工电子邮件地址
  headIcon?: string; // 员工头像
  menuIdList: number[] | string[]; // 员工菜单（权限）ID 列表
}
