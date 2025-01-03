import request from './request';
export const wishingWellService = {
  // 获取推荐的心愿列表
  getWishingSuggestList(params) {
    return request({
      apiKey: 'getWishingSuggestList',
      data: params,
      method: 'GET',
    });
  },
  // 查询用户的历史心愿
  getWishingRecord(params) {
    return request({
      apiKey: 'getWishingRecord',
      data: params,
      method: 'GET',
    });
  },
  // 创建订单
  createWishingOrder(params) {
    return request({
      apiKey: 'createWishingOrder',
      data: params,
      method: 'POST',
    });
  },
  // 创建心愿
  createWishing(params) {
    return request({
      apiKey: 'createWishing',
      data: params,
      method: 'POST',
    });
  },
  // 更新订单支付状态
  updateWishingOrderPayStatus(params) {
    return request({
      apiKey: 'updateWishingOrderPayStatus',
      method: 'POST',
      data: params,
    });
  },
  // 获取竞猜信息
  getWishingGuessInfo(params) {
    return request({
      apiKey: 'getWishingGuessInfo',
      data: params,
      method: 'GET',
    });
  },
  // 提交竞猜
  submitWishingGuess(params) {
    return request({
      apiKey: 'submitWishingGuess',
      data: params,
      method: 'POST',
    });
  },
};
