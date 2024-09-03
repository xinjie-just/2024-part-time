/*
 * “用户”模块
 */
import { IGetUserInfoRes, ILoginReq, ILoginRes } from './models';
import request from '@/services/axios';

const enum API {
  login = '/login', // 登录
  logout = '/logout', // 退出登录
  info = '/info' // 获取当前登录用户信息
}

export const login = (data: ILoginReq) => {
  return request<ILoginRes>({
    url: API.login,
    method: 'post',
    hideLoading: true,
    data
  });
};

export const logout = () => {
  return request<{}>({
    url: API.logout,
    method: 'put',
    hideLoading: true
  });
};

export const getUserInfo = () => {
  return request<IGetUserInfoRes>({
    url: API.info,
    method: 'get',
    hideLoading: true
  });
};
