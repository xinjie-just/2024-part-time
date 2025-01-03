import request from './request';
export const freePruchaseService = {
  // 获取PK商品信息列表
  getPKList(params) {
    return request({
      apiKey: 'getPKList',
      data: params,
      method: 'GET',
    });
  },
  // 获取PK商品详细信息
  getPKDetail(params) {
    return request({
      apiKey: 'getPKDetail',
      data: params,
      method: 'GET',
    });
  },
  // 获取当前用户是否有可以参加的任务
  getPKTask() {
    return request({
      apiKey: 'getPKTask',
      method: 'GET',
    });
  },
  // 创建PK任务
  createPKTask(params) {
    return request({
      apiKey: 'createPKTask',
      method: 'POST',
      data: params,
    });
  },
  // 创建订单
  createPKOrder(params) {
    return request({
      apiKey: 'createPKOrder',
      method: 'POST',
      data: params,
    });
  },
  // 获取 PK 订单信息
  getPKOrderInfo(params) {
    return request({
      apiKey: 'getPKOrderInfo',
      method: 'POST',
      data: params,
    });
  },
  // 获取订单阶段
  getPKOrderStage(params) {
    return request({
      apiKey: 'getPKOrderStage',
      method: 'GET',
      data: params,
    });
  },
  // 支付竞猜金额
  createPKGuessPay(params) {
    return request({
      apiKey: 'createPKGuessPay',
      method: 'POST',
      data: params,
    });
  },
  // 刷新 PK 订单支付状态
  updatePKOrderPayStatus(params) {
    return request({
      apiKey: 'updatePKOrderPayStatus',
      method: 'POST',
      data: params,
    });
  },
  // 获取竞猜信息
  getPKGuessInfo(params) {
    return request({
      apiKey: 'getPKGuessInfo',
      method: 'GET',
      data: params,
    });
  },
  // 提交竞猜
  submitPKGuess(params) {
    return request({
      apiKey: 'submitPKGuess',
      method: 'POST',
      data: params,
    });
  },
  // 创建剩余金额支付订单
  createPKRemainPayOrder(params) {
    return request({
      apiKey: 'createPKRemainPayOrder',
      method: 'POST',
      data: params,
    });
  },
  // 更新剩余金额支付状态
  updatePKOrderRemainPayStatus(params) {
    return request({
      apiKey: 'updatePKOrderRemainPayStatus',
      method: 'POST',
      data: params,
    });
  },
};
