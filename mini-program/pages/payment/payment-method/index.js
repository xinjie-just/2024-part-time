import { mineService } from '../../../services/mine.js';
import { commonService } from '../../../services/common.js';
import { wishingWellService } from '../../../services/wishing-well.js';
import { freePruchaseService } from '../../../services/free-pruchase.js';
import { wechatPay } from '../../../utils/pay.js';
import Toast from '/@vant/weapp/toast/toast';

Component({
  /**
   * 页面的初始数据
   */
  properties: {
    hidePoints: false,
    source: 'wishing',
    payOrderId: '',
    orderId: '',
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
    payLoading: false,
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
  onLoad(options) {},

  methods: {
    onChange(event) {
      this.setData({
        radio: event.detail,
      });
    },

    async onConfirm() {
      this.setData({
        payLoading: true,
      });
      if (this.data.radio === 'wechat') {
        const wechatPayResult = await wechatPay(this.data.payOrderId);
        wx.requestPayment({
          ...wechatPayResult,
          package: wechatPayResult.packageVal,
          success: (success) => {
            const msg = success.errMsg;
            if (msg === 'requestPayment:ok') {
              // 成功
              this.updateOrderPayStatus();
            }
          },
          fail: (fail) => {
            this.setData({
              payLoading: false,
            });
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
        commonService
          .pointPay({ payOrderId: this.data.payOrderId })
          .then(() => {
            this.updateOrderPayStatus();
          })
          .catch(() => {
            this.setData({
              payLoading: false,
            });
          });
      } else if (this.data.radio === 'balance') {
        commonService
          .balancePay({ payOrderId: this.data.payOrderId })
          .then(() => {
            this.updateOrderPayStatus();
          })
          .catch(() => {
            this.setData({
              payLoading: false,
            });
          });
      }
    },
    onGoBack() {
      this.triggerEvent('close');
    },

    // 更新订单支付状态
    updateOrderPayStatus() {
      if (this.data.source === 'pk') {
        const params = {
          orderId: this.data.orderId,
          payOrderType: 1, // 1：竞猜支付，2：剩余金额支付
        };
        freePruchaseService
          .updatePKOrderPayStatus(params)
          .then((result) => {
            const paySuccess = result.paySuccess ?? false;
            if (paySuccess) {
              Toast({
                type: 'success',
                message: '支付成功',
                onClose: () => {
                  this.triggerEvent('confirm');
                },
              });
            }
          })
          .finally(() => {
            this.setData({
              payLoading: false,
            });
          });
      } else if (this.data.source === 'wishing') {
        const params = {
          orderId: this.data.orderId,
        };
        wishingWellService
          .updateWishingOrderPayStatus(params)
          .then((result) => {
            const paySuccess = result.paySuccess ?? false;
            if (paySuccess) {
              Toast({
                type: 'success',
                message: '支付成功',
                onClose: () => {
                  this.triggerEvent('confirm');
                },
              });
            }
          })
          .finally(() => {
            this.setData({
              payLoading: false,
            });
          });
      }
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
