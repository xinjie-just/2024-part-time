/**
 * @description 登录 /login
 */
export interface ILoginReq {
  phone: string;
  password: string;
}
export interface ILoginRes {
  token: string;
}

/**
 * @description 获取当前登录用户信息 /info
 */
export interface IGetUserInfoRes {
  id: number;
  shopId: number; // 店铺 ID
  name: string;
  loginName: string;
  phone: string;
  email: string;
  type: number;
  registerTime: string;
  headIcon: string;
  remark?: string;
  state: number;
}

/**
 * @description 修改登录密码 /update-password
 */
export interface IUpdatePasswordReq {
  newPassword: string;
  verifyCode: string;
}

/**
 * @description 重置用户密码 /reset-password
 */
export interface IResetPasswordReq {
  newPassword: string;
  verifyCode: string;
  phone: string;
}
