import { commonService } from '../services/common.js';

export const pay = () => {
  let payResult = '';
  return commonService.pay()
    .then(async (result) => {
      console.log('获取微信支付接口所需参数---result', result);
      await wx.requestPayment({
        ...result,
        package: result.packageVal,
        success: (res) => {
          console.log('success---res', res);
          const msg = res.errMsg;
          if (msg === 'requestPayment:ok') {
            // 成功
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 3000,
            });
            payResult = 'success';
          }
        },
        fail: (res) => {
          console.log('fail---res', res);
          const msg = res.errMsg;
          if (msg === 'requestPayment:fail cancel') {
            // 用户取消支付
            wx.showToast({
              title: '用户取消支付',
              icon: 'error',
              duration: 3000,
            });
            payResult = 'cancel';
          } else if (msg === `requestPayment:fail (${detailMessage})`) {
            wx.showToast({
              title: detailMessage,
              duration: 3000,
            });
            payResult = 'fail';
          }
        },
      });
      return payResult;
    })
    .catch(() => {
      payResult = 'fail';
      return payResult;
    })
};
