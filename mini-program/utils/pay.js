import { commonService } from '../services/common.js';

export const wechatPay = (orderNumber) => {
  return commonService.wechatPay({ orderNumber }).then((res) => {
    if (!res.signType) {
      wx.showToast({
        title: '获取微信支付签名失败',
        icon: 'none',
        duration: 3500,
      });
      return Promise.reject();
    } else {
      return Promise.resolve(res);
    }
  });
};
