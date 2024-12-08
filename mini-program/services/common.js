import request from "./request";
export const commonService = {
  // 获取系统时间
  getSystemTime() {
    return request({
      'apiKey': 'getSystemTime',
      'method': 'GET'
    });
  },
  // 获取用户信息
  getUserInfo() {
    return request({
      'apiKey': 'getUserInfo',
      'method': 'GET'
    });
  },
  // 获取微信支付需要的参数
  pay() {
    return request({
      'apiKey': 'pay',
      'method': 'POST'
    });
  },
  // 石头剪刀布，准备阶段
  rpsReady() {
    return request({
      'apiKey': 'rpsReady',
      'method': 'POST'
    });
  },
  // 石头剪刀布，开始匹配
  rpsMatch() {
    return request({
      'apiKey': 'rpsMatch',
      'method': 'POST'
    });
  },
  // 石头剪刀布，获取对局信息
  rpsGameInfo() {
    return request({
      'apiKey': 'rpsGameInfo',
      'method': 'GET'
    });
  },
  // 石头剪刀布，开始游戏 
  rpsStart() {
    return request({
      'apiKey': 'rpsStart',
      'method': 'POST'
    });
  },
  // 石头剪刀布，提交游戏内容
  rpsSubmit(params) {
    // punch: 1:石头；2:剪刀；3:布
    return request({
      'apiKey': 'rpsSubmit',
      'method': 'POST',
      'data': params
    });
  },
  // 石头剪刀布，查询游戏结果
  rpsResult(params) {
    // punch: 1:石头；2:剪刀；3:布
    return request({
      'apiKey': 'rpsResult',
      'method': 'GET',
      'data': params
    });
  },
};