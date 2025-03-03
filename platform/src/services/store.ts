/*
 * “店铺”模块
 */
import {
  IGetAgentShopListReq,
  IGetAgentShopListRes,
  IDeleteShopReq,
  ILockUnLockReq,
  IGetShopDetailsRes,
  IUpdateMyShopReq,
  IAddAgentShopReq
} from './models';
import request from '@/services/axios';

const enum API {
  getAgentShopList = '/shop/proxy-list', // 查询代营店铺列表
  addAgentShop = '/shop/proxy-create', // 添加代理店铺
  deleteShop = '/shop/remove', // 删除店铺
  lockUnLockShop = '/shop/update-state', // 锁定/解锁
  getMyShopDetails = '/shop/info', // 查询店铺明细信息
  updateMyShop = '/shop/save', // 编辑我的店铺
  upgradeMyShop = '/shop/upgrade' // 升级我的店铺
}

export const getAgentShopList = (data: IGetAgentShopListReq) => {
  return request<IGetAgentShopListRes>({
    url: API.getAgentShopList,
    method: 'get',
    data
  });
};

export const addAgentShop = (data: IAddAgentShopReq) => {
  return request<null>({
    url: API.addAgentShop,
    method: 'post',
    data
  });
};

export const deleteShop = (data: IDeleteShopReq) => {
  return request<null>({
    url: API.deleteShop,
    method: 'delete',
    data
  });
};

export const lockUnLockShop = (data: ILockUnLockReq) => {
  return request<null>({
    url: API.lockUnLockShop,
    method: 'put',
    data
  });
};

export const getMyShopDetails = (data: { id: number }) => {
  return request<IGetShopDetailsRes>({
    url: API.getMyShopDetails,
    method: 'get',
    data
  });
};

export const updateMyShop = (data: IUpdateMyShopReq) => {
  return request<null>({
    url: API.updateMyShop,
    method: 'put',
    data
  });
};

export const upgradeMyShop = () => {
  return request<null>({
    url: API.upgradeMyShop,
    method: 'post'
  });
};
