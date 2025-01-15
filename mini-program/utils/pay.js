import { commonService } from '../services/common.js';

export const wechatPay = (payOrderId) => {
  return commonService.wechatPay({ payOrderId })
    .then((res) => {
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
    })
    .catch((error) => {
      wx.showToast({
        title: error,
        icon: 'none',
        duration: 3500,
      });
      return Promise.reject();
    })
};
