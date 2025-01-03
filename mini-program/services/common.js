import request from './request';
export const commonService = {
  // 获取系统时间
  getSystemTime() {
    return request({
      apiKey: 'getSystemTime',
      method: 'GET',
    });
  },
  // 获取用户信息
  getUserInfo() {
    return request({
      apiKey: 'getUserInfo',
      method: 'GET',
    });
  },
  // 微信支付
  wechatPay(params) {
    return request({
      apiKey: 'wechatPay',
      method: 'POST',
      data: params,
    });
  },
  // 积分支付
  pointPay(params) {
    return request({
      apiKey: 'pointPay',
      method: 'POST',
      data: params,
    });
  },
  // 余额支付
  balancePay(params) {
    return request({
      apiKey: 'balancePay',
      method: 'POST',
      data: params,
    });
  },
  // 石头剪刀布，准备阶段
  gameRPSReady() {
    return request({
      apiKey: 'gameRPSReady',
      method: 'POST',
    });
  },
  // 石头剪刀布，开始匹配
  gameRPSMatch() {
    return request({
      apiKey: 'gameRPSMatch',
      method: 'POST',
    });
  },
  // 石头剪刀布，获取对局信息
  getGameRPSInfo() {
    return request({
      apiKey: 'getGameRPSInfo',
      method: 'GET',
    });
  },
  // 石头剪刀布，开始游戏
  gameRPSStart() {
    return request({
      apiKey: 'gameRPSStart',
      method: 'POST',
    });
  },
  // 石头剪刀布，提交游戏内容
  gameRPSSubmit(params) {
    // punch: 1:石头；2:剪刀；3:布
    return request({
      apiKey: 'gameRPSSubmit',
      method: 'POST',
      data: params,
    });
  },
  // 石头剪刀布，查询游戏结果
  getGameRPSResult(params) {
    // punch: 1:石头；2:剪刀；3:布
    return request({
      apiKey: 'getGameRPSResult',
      method: 'GET',
      data: params,
    });
  },

  // 双十拳，准备阶段
  gameDTBReady() {
    return request({
      apiKey: 'gameDTBReady',
      method: 'POST',
    });
  },
  // 双十拳，开始匹配
  gameDTBMatch() {
    return request({
      apiKey: 'gameDTBMatch',
      method: 'POST',
    });
  },
  // 双十拳，获取对局信息
  getGameDTBInfo() {
    return request({
      apiKey: 'getGameDTBInfo',
      method: 'GET',
    });
  },
  // 双十拳，开始游戏
  gameDTBStart() {
    return request({
      apiKey: 'gameDTBStart',
      method: 'POST',
    });
  },
  // 双十拳，提交游戏内容
  gameDTBSubmit(params) {
    // punch: 1:石头；2:剪刀；3:布
    return request({
      apiKey: 'gameDTBSubmit',
      method: 'POST',
      data: params,
    });
  },
  // 双十拳，查询游戏结果
  getGameDTBResult(params) {
    // punch: 1:石头；2:剪刀；3:布
    return request({
      apiKey: 'getGameDTBResult',
      method: 'GET',
      data: params,
    });
  },
};
