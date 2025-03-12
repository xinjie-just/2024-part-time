/**
 * @description 获取员工列表 /admin/list
 */
export interface IGetConfigListReq {
  name?: string; // 员工名称
  phone?: string; // 手机号码
  page: number; // 页码
  pageSize: number; // 每页数量
}
export interface IGetConfigListRes {
  totalNum: number;
  list: IConfigList[];
}
export interface IConfigList {
  id: number; // 员工ID
  name: string; // 员工名称
  loginName: string; // 员工昵称
  phone: string; // 手机号码
  registerTime: string; // 注册时间
}

/**
 * @description 查询员工详细信息（包括权限） /admin/info
 */
export interface IGetConfigInfoReq {
  adminId: number; // 员工ID
}
export interface IGetConfigInfoRes {
  id: number; // 员工ID
  name: string; // 员工名称
  loginName: string; // 员工登录名称
  phone: string; // 员工手机号码
  password: string; // 员工登录密码
  menuPathList: string[];
}

/**
 * @description 保存员工信息 /admin/save
 */
export interface ISaveConfigInfoReq {
  id?: number; // 员工ID
  name: string; // 员工名称
  loginName: string; // 员工登录名称
  password: string; // 员工登录密码
  phone: string; // 员工手机号码
  email?: string; // 员工电子邮件地址
  headIcon?: string; // 员工头像
  menuPathList: number[] | string[]; // 员工菜单（权限）ID 列表
}
