/*
 * “店铺”模块
 */
import {
  IUpdatePasswordReq,
  IGetAgentShopListReq,
  IGetAgentShopListRes,
  IDeleteShopReq,
  ILockUnLockReq,
  IGetShopDetailsRes,
  IUpdateMyShopReq
} from './models';
import request from '@/services/axios';

const enum API {
  updatePassword = '/shop/save-password', // 修改店铺密码
  getAgentShopList = '/shop/shop-proxy-list', // 查询代营店铺列表
  deleteShop = '/shop/remove', // 删除店铺
  lockUnLockShop = '/shop/update-state', // 锁定/解锁
  getMyShopDetails = '/shop/info', // 查询店铺明细信息
  updateMyShop = '/shop/save', // 编辑我的店铺
  upgradeMyShop = '/shop/upgrade' // 升级我的店铺
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

export const lockUnLockShop = (data: ILockUnLockReq) => {
  return request<null>({
    url: API.lockUnLockShop,
    method: 'put',
    hideLoading: true,
    data
  });
};

export const getMyShopDetails = () => {
  return request<IGetShopDetailsRes>({
    url: API.getMyShopDetails,
    method: 'get',
    hideLoading: true
  });
};

export const updateMyShop = (data: IUpdateMyShopReq) => {
  return request<null>({
    url: API.updateMyShop,
    method: 'post',
    hideLoading: true,
    data
  });
};

export const upgradeMyShop = () => {
  return request<null>({
    url: API.upgradeMyShop,
    method: 'post',
    hideLoading: true
  });
};
