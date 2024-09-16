/*
 * “线上商城”模块
 */
import {
  IGetPKListReq,
  IGetPKListRes,
  IGetPKOrderListReq,
  IGetPKOrderListRes,
  IPKOrderShippingReq,
  IPKOrderReturnsReq,
  IGetScanOrderListReq,
  IGetScanOrderListRes,
  IGetWishingOrderListReq,
  IGetWishingOrderListRes,
  ISavePKReq,
  ISetPKStateReq,
  IGetScanListReq,
  IGetScanListRes,
  ISaveScanReq,
  ISetScanStateReq,
  IGetWishingListReq,
  IGetWishingListRes,
  ISaveWishingReq,
  ISetWishingStateReq,
  IGetPKPlayerListReq,
  IGetPKPlayerListRes,
  IGetToDoSelectPlayerListReq,
  IGetToDoSelectPlayerListRes
} from './models';
import request from '@/services/axios';

const enum API {
  getPKList = '/product-pk/list', // 查询 PK 商品列表
  savePK = '/product-pk/save', // 新增/编辑 PK 商品  // TODO
  setPKState = '/product-pk/sell', // 修改 PK 商品上下线状态
  getScanList = '/product-scan/list', // 查询扫一扫商品列表
  saveScan = '/product-scan/save', // 新增/编辑扫一扫商品 // TODO
  setScanState = '/product-scan/sell', // 修改扫一扫商品上下线状态
  getWishingList = '/product-wish/list', // 查询创意许愿商品列表
  saveWishing = '/product-wish/save', // 新增/编辑创意许愿商品 // TODO
  setWishingState = '/product-wish/sell', // 修改创意许愿商品上下线状态
  getPKOrderList = '/product-pk-order/list', // 订单管理-PK 品-订单列表
  PKOrderShipping = '/product-pk-order/deliver-goods', // 订单管理-PK 品-订单发货 // TODO
  PKOrderReturns = '/product-pk-order/sales-return', // 订单管理-PK 品-订单退货
  getScanOrderList = '/product-scan-order/list', // 订单管理-扫一扫-订单列表
  getWishingOrderList = '/product-wish-order/list', // 订单管理-创意许愿-订单列表
  getPKPlayerList = '/player-pk/list', // PK 手管理-查询 PK 手列表
  getToDoSelectPlayerList = '/player-pk/list-by-shop', // PK 手管理-查询店铺的 PK 选手信息列表
  savePKPlayer = '/player-pk/save', // PK 手管理-新增/编辑PK手信息
  deletePKPlayer = '/player-pk/remove' // PK 手管理-删除PK手
}

export const getPKList = (data: IGetPKListReq) => {
  return request<IGetPKListRes>({
    url: API.getPKList,
    method: 'get',
    data
  });
};

export const savePK = (data: ISavePKReq) => {
  return request<null>({
    url: API.savePK,
    method: 'post',
    data
  });
};

export const setPKState = (data: ISetPKStateReq) => {
  return request<null>({
    url: API.setPKState,
    method: 'put',
    data
  });
};

export const getScanList = (data: IGetScanListReq) => {
  return request<IGetScanListRes>({
    url: API.getScanList,
    method: 'get',
    data
  });
};

export const saveScan = (data: ISaveScanReq) => {
  return request<null>({
    url: API.saveScan,
    method: 'post',
    data
  });
};

export const setScanState = (data: ISetScanStateReq) => {
  return request<null>({
    url: API.setScanState,
    method: 'put',
    data
  });
};

export const getWishingList = (data: IGetWishingListReq) => {
  return request<IGetWishingListRes>({
    url: API.getWishingList,
    method: 'get',
    data
  });
};

export const saveWishing = (data: ISaveWishingReq) => {
  return request<null>({
    url: API.saveWishing,
    method: 'post',
    data
  });
};

export const setWishingState = (data: ISetWishingStateReq) => {
  return request<null>({
    url: API.setWishingState,
    method: 'put',
    data
  });
};

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

export const getPKPlayerList = (data: IGetPKPlayerListReq) => {
  return request<IGetPKPlayerListRes>({
    url: API.getPKPlayerList,
    method: 'get',
    data
  });
};

export const getToDoSelectPlayerList = (data: IGetToDoSelectPlayerListReq) => {
  return request<IGetToDoSelectPlayerListRes>({
    url: API.getToDoSelectPlayerList,
    method: 'get',
    data
  });
};

export const savePKPlayer = (data: { ids: number[] }) => {
  return request<null>({
    url: API.savePKPlayer,
    method: 'post',
    data
  });
};

export const deletePKPlayer = (data: { id: number }) => {
  return request<null>({
    url: API.deletePKPlayer,
    method: 'delete',
    data
  });
};
