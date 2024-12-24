import request from "./request";
export const wishingWellService = {
  // 获取推荐的心愿列表
  wishingSuggestList(params) {
    return request({
      'apiKey': 'wishingSuggestList',
      'data': params,
      'method': 'GET'
    });
  },
  // 查询用户的历史心愿
  wishingRecord(params) {
    return request({
      'apiKey': 'wishingRecord',
      'data': params,
      'method': 'GET'
    });
  },
  // 创建订单
  createWishingOrder(params) {
    return request({
      'apiKey': 'createWishingOrder',
      'data': params,
      'method': 'POST'
    });
  },
  // 创建心愿
  createWishing(params) {
    return request({
      'apiKey': 'createWishing',
      'data': params,
      'method': 'POST'
    });
  },
};