/**
 * @description 登录 /login
 */
export interface ILoginReq {
  loginName: string;
  passWord: string;
}
export interface ILoginRes {
  token: string;
  id: number;
  shopId: number;
  userName: string;
  loginName: string;
  phone: string;
  email: string;
  type: number;
  registerTime: string;
  headIcon: string;
  remake: string;
  state: number;
}

/**
 * @description 获取当前登录用户信息 /info
 */
export interface IGetUserInfoRes {
  id: number;
  name: string;
  loginName: string;
  phone: string;
  email: string;
  registerTime: string;
  headIcon: string;
}
