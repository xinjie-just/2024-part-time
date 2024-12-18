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
  // 获取商品竞猜位数
  getGuessDetail(params) {
    return request({
      'apiKey': 'getGuessDetail',
      'method': 'GET',
      'data': params
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
  createOrder(params) {
    return request({
      'apiKey': 'createOrder',
      'method': 'POST',
      'data': params
    });
  },
  // 刷新订单支付状态
  refreshOrderPay(params) {
    return request({
      'apiKey': 'refreshOrderPay',
      'method': 'POST',
      'data': params
    });
  },
};