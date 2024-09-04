/*
 * “用户”模块
 */
import {
  IUpdatePasswordReq,
  IGetAgentShopListReq,
  IGetAgentShopListRes,
  IDeleteShopReq
} from './models';
import request from '@/services/axios';

const enum API {
  updatePassword = '/shop/save-pass-word', // 修改店铺密码
  getAgentShopList = '/shop/shop-proxy-list', // 查询代营店铺列表
  deleteShop = '/shop/remove' // 删除店铺
}

export const updatePassword = (data: IUpdatePasswordReq) => {
  return request<null>({
    url: API.updatePassword,
    method: 'put',
    hideLoading: true,
    data
  });
};

export const getAgentShopList = (data: IGetAgentShopListReq) => {
  return request<IGetAgentShopListRes>({
    url: API.getAgentShopList,
    method: 'get',
    hideLoading: true,
    data
  });
};

export const deleteShop = (data: IDeleteShopReq) => {
  return request<null>({
    url: API.deleteShop,
    method: 'delete',
    hideLoading: true,
    data
  });
};
