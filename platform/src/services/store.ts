/*
 * “店铺”模块
 */
import {
  IGetShopListReq,
  IGetShopListRes,
  IDeleteShopReq,
  ILockUnLockReq,
  IAddShopReq
} from './models';
import request from '@/services/axios';

const enum API {
  getShopList = '/shop/list', // 店铺列表
  addShop = '/shop/add', // 添加店铺
  deleteShop = '/shop/remove', // 删除店铺
  lockUnLockShop = '/shop/lock' // 锁定/解锁
}

export const getShopList = (data: IGetShopListReq) => {
  return request<IGetShopListRes>({
    url: API.getShopList,
    method: 'get',
    data
  });
};

export const addShop = (data: IAddShopReq) => {
  return request<null>({
    url: API.addShop,
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
