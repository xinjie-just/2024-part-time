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
};