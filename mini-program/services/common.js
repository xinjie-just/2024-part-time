import request from "./request";
export const commonService = {
  // 获取微信支付需要的参数
  pay() {
    return request({
      'apiKey': 'pay',
      'method': 'POST'
    });
  },
  // 石头剪刀布准备阶段
  rpsReady() {
    return request({
      'apiKey': 'rpsReady',
      'method': 'POST'
    });
  },
  // 石头剪刀布开始匹配
  rpsMatch() {
    return request({
      'apiKey': 'rpsMatch',
      'method': 'POST'
    });
  },
  // 石头剪刀布获取对手信息
  rpsRiverDetail() {
    return request({
      'apiKey': 'rpsRiverDetail',
      'method': 'GET'
    });
  },
  // 石头剪刀布提交游戏内容
  rpsSubmit(params) {
    // punch: 1:石头；2:剪刀；3:布
    return request({
      'apiKey': 'rpsSubmit',
      'method': 'POST',
      'data': params
    });
  },
};