import { commonService } from '../services/common.js';

export const wechatPay = (orderNumber) => {
  return commonService.wechatPay({ orderNumber }).then((res) => {
    const payParams = res.wechatPrepayParam;
    if (!payParams.paySign) {
      wx.showToast({
        title: '获取微信支付签名失败',
        icon: 'none',
        duration: 3500,
      });
      return Promise.reject();
    } else {
      return Promise.resolve(payParams);
    }
  });
};
