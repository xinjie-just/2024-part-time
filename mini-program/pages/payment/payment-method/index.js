import { mineService } from '../../../services/mine.js';
import { commonService } from '../../../services/common.js';
import { wechatPay } from '../../../utils/pay.js';
import Toast from '/@vant/weapp/toast/toast';

Component({
  /**
   * 页面的初始数据
   */
  properties: {
    hidePoints: false,
    source: 'wishing',
    orderNumber: '',
    orderPrice: 0,
  },

  data: {
    payReadied: true,
    exchangeRate: 100, // 汇率（1元兑换多少积分）
    radio: 'wechat',
    balance: 0,
    pointTotal: 0,
    disabledPoint: false,
    disabledBalance: false,
  },

  lifetimes: {
    attached() {
      if (this.data.orderPrice === null || this.data.orderPrice === undefined) {
        Toast({
          type: 'fail',
          message: '订单价格获取失败',
          duration: 3500,
        });
        this.setData({
          payReadied: false,
        });
        return;
      }
      // 获取总的可用余额数
      this.getBalance();
      if (!this.data.hidePoints) {
        // 获取总的可用积分数
        this.getPointTotal();
      }
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) { },

  methods: {
    onChange(event) {
      this.setData({
        radio: event.detail,
      });
    },

    async onConfirm() {
      if (this.data.radio === 'wechat') {
        const wechatPayResult = await wechatPay(this.data.orderNumber);
        wx.requestPayment({
          ...wechatPayResult,
          package: wechatPayResult.packageVal,
          success: (success) => {
            const msg = success.errMsg;
            if (msg === 'requestPayment:ok') {
              // 成功
              Toast({
                type: 'success',
                message: '支付成功',
                onClose: () => {
                  this.triggerEvent('confirm');
                },
              });
            }
          },
          fail: (fail) => {
            const msg = fail.errMsg;
            if (msg === 'requestPayment:fail cancel') {
              // 用户取消支付
              Toast({
                type: 'fail',
                message: '用户取消支付',
                duration: 3000,
              });
            } else if (msg === `requestPayment:fail (${detailMessage})`) {
              Toast({
                type: 'fail',
                message: detailMessage,
                duration: 3000,
              });
            }
          },
        });
      } else if (this.data.radio === 'point') {
        commonService.pointPay({ orderNumber: this.data.orderNumber })
          .then(() => {
            Toast({
              type: 'success',
              message: '支付成功',
              onClose: () => {
                this.triggerEvent('confirm');
              },
            });
          });
      } else if (this.data.radio === 'balance') {
        commonService.balancePay({ orderNumber: this.data.orderNumber })
          .then(() => {
            Toast({
              type: 'success',
              message: '支付成功',
              onClose: () => {
                this.triggerEvent('confirm');
              },
            });
          });
      }
    },
    onGoBack() {
      this.triggerEvent('close');
    },

    getBalance() {
      mineService.walletInfo().then((result) => {
        const balance = result.balance ?? 0;
        this.setData({
          balance,
          disabledBalance: this.data.orderPrice > balance,
        });
      });
    },
    getPointTotal() {
      mineService.pointTotal().then((result) => {
        const totalIntegral = result.totalIntegral ?? 0;
        this.setData({
          pointTotal: totalIntegral,
          disabledPoint: this.data.orderPrice > totalIntegral / this.data.exchangeRate,
        });
      });
    },
  },
});
