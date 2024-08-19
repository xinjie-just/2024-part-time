// pages/payment-method/index.js
import Toast from '/@vant/weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio: 'point',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },

  onClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      radio: name,
    });
  },

  onGoBack() {
    wx.navigateBack();
  },

  onConfirm() {
    Toast({
      type: 'success',
      message: '支付成功',
      onClose: () => {
        wx.redirectTo({
          url: 'guessing',
        });
      },
    });
  }
})