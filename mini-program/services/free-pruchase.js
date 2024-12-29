import request from "./request";
export const freePruchaseService = {
  // 获取PK商品信息列表
  PKList(params) {
    return request({
      'apiKey': 'PKList',
      'data': params,
      'method': 'GET'
    });
  },
  // 获取PK商品详细信息
  PKDetail(params) {
    return request({
      'apiKey': 'PKDetail',
      'data': params,
      'method': 'GET'
    });
  },
  // 获取当前用户是否有可以参加的任务
  PKTask() {
    return request({
      'apiKey': 'PKTask',
      'method': 'GET'
    });
  },
  // 创建PK任务
  createPKTask(params) {
    return request({
      'apiKey': 'createPKTask',
      'method': 'POST',
      'data': params
    });
  },
  // 创建订单
  createPKOrder(params) {
    return request({
      'apiKey': 'createPKOrder',
      'method': 'POST',
      'data': params
    });
  },
  // 获取 PK 订单信息
  getPKOrderInfo(params) {
    return request({
      'apiKey': 'getPKOrderInfo',
      'method': 'POST',
      'data': params
    });
  },
  // 刷新 PK 订单支付状态
  updatePKOrderPayStatus(params) {
    return request({
      'apiKey': 'updatePKOrderPayStatus',
      'method': 'POST',
      'data': params
    });
  },
};