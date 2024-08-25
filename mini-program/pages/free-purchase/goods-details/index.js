import Toast from '/@vant/weapp/toast/toast';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    paymentMethodShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      id: +options.id,
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
    Toast({
      type: 'success',
      message: '支付成功',
      onClose: () => {
        wx.redirectTo({
          url: 'guessing',
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
