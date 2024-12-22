import { mineService } from '../../../services/mine.js';
import { freePruchaseService } from '../../../services/free-pruchase.js';
import { commonService } from '../../../services/common.js';

Component({
  /**
   * 页面的初始数据
   */
  properties: {
    hidePoints: false,
    price: 0,
    productId: null,
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
      // 获取总的可用余额数
      if (this.data.price === null || this.data.price === undefined) {
        wx.showToast({
          title: '订单价格获取失败',
          icon: 'none',
          duration: 4000
        });
        this.setData({
          payReadied: false
        });
        return;
      }
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
  onLoad(options) {},

  methods: {
    onChange(event) {
      this.setData({
        radio: event.detail,
      });
    },

    onConfirm() {
      // 先创建订单
      const params = {
        productPkId: this.data.productId,
      };
      freePruchaseService.createOrder(params).then(async (res) => {
        const orderNumber = res.orderNumber;
        if (this.data.radio === 'wechat') {
          const wechatPayResult = await commonService.wechatPay(orderNumber);
          wx.requestPayment({
            ...wechatPayResult,
            package: wechatPayResult.packageVal,
            success: (success) => {
              const msg = success.errMsg;
              if (msg === 'requestPayment:ok') {
                // 成功
                wx.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 3000,
                  success: () => {
                    this.triggerEvent('confirm');
                  },
                });
              }
            },
            fail: (fail) => {
              const msg = fail.errMsg;
              if (msg === 'requestPayment:fail cancel') {
                // 用户取消支付
                wx.showToast({
                  title: '用户取消支付',
                  icon: 'error',
                  duration: 3000,
                });
              } else if (msg === `requestPayment:fail (${detailMessage})`) {
                wx.showToast({
                  title: detailMessage,
                  duration: 3000,
                });
              }
            },
          });
        } else if (this.data.radio === 'point') {
          commonService.pointPay({ orderNumber }).then((res) => {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              success: () => {
                this.triggerEvent('confirm');
              },
            });
          });
        } else if (this.data.radio === 'balance') {
          commonService.balancePay({ orderNumber }).then((res) => {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              success: () => {
                this.triggerEvent('confirm');
              },
            });
          });
        }
      });
    },
    onGoBack() {
      this.triggerEvent('close');
    },

    getBalance() {
      mineService.walletInfo().then((result) => {
        const balance = result.balance ?? 0;
        this.setData({
          balance,
          disabledBalance: this.data.price > balance,
        });
      });
    },
    getPointTotal() {
      mineService.pointTotal().then((result) => {
        const totalIntegral = result.totalIntegral ?? 0;
        this.setData({
          pointTotal: totalIntegral,
          disabledPoint: this.data.price > totalIntegral / this.data.exchangeRate,
        });
      });
    },
  },
});
