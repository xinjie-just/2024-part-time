import request from "./request";
export const mineService = {
  // 获取用户积分信息
  pointTotal() {
    return request({
      'apiKey': 'pointTotal',
      'method': 'GET'
    });
  },
  // 获取用户积分明细列表
  pointDetailList(params) {
    return request({
      'apiKey': 'pointDetailList',
      'data': params,
      'method': 'GET'
    });
  },
  // 获取用户钱包信息
  walletInfo() {
    return request({
      'apiKey': 'walletInfo',
      'method': 'GET'
    });
  },
  // 获取用户钱包明细列表
  walletDetailList(params) {
    return request({
      'apiKey': 'walletDetailList',
      'data': params,
      'method': 'GET'
    });
  },
  // 成为PK手
  toBecomePKer(params) {
    return request({
      'apiKey': 'toBecomePKer',
      'method': 'POST',
      'data': params,
    });
  }
};