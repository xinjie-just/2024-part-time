import Toast from '/@vant/weapp/toast/toast';
import { freePruchaseService } from '../../../services/free-pruchase.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    paymentMethodShow: false,
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      id: +options.id,
    },
      () => {
        this.getPKDetail()
      }
    );
  },

  getPKDetail() {
    const params = {
      id: this.data.id
    };
    freePruchaseService.PKDetail(params)
      .then(res => {
        this.setData({
          detail: res
        })
      })
  },

  onToSelectPaymentMethod() {
    // wx.navigateTo({
    //   url: '/pages/payment-method/index',
    // })

    this.setData({
      paymentMethodShow: true,
    });
  },

  onConfirm() {
    this.setData({
      paymentMethodShow: false,
    });
    Toast({
      type: 'success',
      message: '支付成功',
      onClose: () => {
        wx.redirectTo({
          url: '../../payment/digital-guessing/index?source=freePurchase',
        });
      },
    });
  },

  onClose() {
    this.setData({
      paymentMethodShow: false,
    });
  },
});
