/*
 * “用户”模块
 */
import { IGetUserInfoRes, ILoginReq, ILoginRes, IUpdatePasswordReq } from './models';
import request from '@/services/axios';

const enum API {
  login = '/login', // 登录
  logout = '/logout', // 退出登录
  info = '/info', // 获取当前登录用户信息
  updatePassword = '/update-password' // 修改登录密码
}

export const login = (data: ILoginReq) => {
  return request<ILoginRes>({
    url: API.login,
    method: 'post',
    data
  });
};

export const logout = () => {
  return request<{}>({
    url: API.logout,
    method: 'put'
  });
};

export const getUserInfo = () => {
  return request<IGetUserInfoRes>({
    url: API.info,
    method: 'get'
  });
};

export const updatePassword = (data: IUpdatePasswordReq) => {
  return request<null>({
    url: API.updatePassword,
    method: 'put',
    data
  });
};
