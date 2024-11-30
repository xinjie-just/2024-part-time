
import { commonService } from '../services/common.js';

export const pay = () => {
  return commonService.pay()
    .then((result) => {
      console.log("获取微信支付接口所需参数---result", result);
      wx.requestPayment({
        ...result,
        "package": result.packageVal,
        "success": function (res) {
          console.log("success---res", res);
          const msg = res.errMsg;
          if (msg === "requestPayment:ok") {
            // 成功
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 3000
            });
            return Promise.resolve('success');
          }
        },
        "fail": function (res) {
          console.log("fail---res", res);
          const msg = res.errMsg;
          if (msg === "requestPayment:fail cancel") {
            // 用户取消支付
            wx.showToast({
              title: '用户取消支付',
              icon: 'error',
              duration: 3000
            });
            return Promise.resolve('cancel');
          } else if (msg === `requestPayment:fail (${detailMessage})`) {
            wx.showToast({
              title: detailMessage,
              duration: 3000
            });
            return Promise.resolve('fail');
          }
        },
        "complete": function (res) {
          console.log("complete---res", res);
        }
      })
    })
    .finally(() => {
    })
}