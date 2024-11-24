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
};