/*
 * “线上商城”模块
 */
import {
  IGetPKOrderListReq,
  IGetPKOrderListRes,
  IPKOrderShippingReq,
  IPKOrderReturnsReq,
  IGetScanOrderListReq,
  IGetScanOrderListRes,
  IGetWishingOrderListReq,
  IGetWishingOrderListRes
} from './models';
import request from '@/services/axios';

const enum API {
  getPKOrderList = '/product-pk-order/list', // 订单管理-PK 品-订单列表
  PKOrderShipping = '/product-pk-order/deliver-goods', // 订单管理-PK 品-订单发货
  PKOrderReturns = '/product-pk-order/sales-return', // 订单管理-PK 品-订单退货
  getScanOrderList = '/product-scan-order/list', // 订单管理-扫一扫-订单列表
  getWishingOrderList = '/product-wish-order/list' // 订单管理-创意许愿-订单列表
}

export const getPKOrderList = (data: IGetPKOrderListReq) => {
  return request<IGetPKOrderListRes>({
    url: API.getPKOrderList,
    method: 'get',
    data
  });
};

export const PKOrderShipping = (data: IPKOrderShippingReq) => {
  return request<null>({
    url: API.PKOrderShipping,
    method: 'post',
    data
  });
};

export const PKOrderReturns = (data: IPKOrderReturnsReq) => {
  return request<null>({
    url: API.PKOrderReturns,
    method: 'post',
    data
  });
};

export const getScanOrderList = (data: IGetScanOrderListReq) => {
  return request<IGetScanOrderListRes>({
    url: API.getScanOrderList,
    method: 'get',
    data
  });
};

export const getWishingOrderList = (data: IGetWishingOrderListReq) => {
  return request<IGetWishingOrderListRes>({
    url: API.getWishingOrderList,
    method: 'get',
    data
  });
};
