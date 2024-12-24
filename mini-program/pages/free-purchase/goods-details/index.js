import Toast from '/@vant/weapp/toast/toast';
import { freePruchaseService } from '../../../services/free-pruchase.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    paymentMethodShow: false,
    detail: {},
    orderNumber: '',
    orderPrice: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData(
      {
        id: +options.id,
      },
      () => {
        this.getPKDetail();
      },
    );
  },

  getPKDetail() {
    const params = {
      id: this.data.id,
    };
    freePruchaseService.PKDetail(params).then((res) => {
      this.setData({
        detail: res,
      });
    });
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
    wx.redirectTo({
      url: `../../payment/digital-guessing/index?source=freePurchase&productId=${this.data.id}`,
    });
  },

  onClose() {
    this.setData({
      paymentMethodShow: false,
    });
  },
});
