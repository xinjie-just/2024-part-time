// pages/free-purchase/p-k-field/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    active: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  onShowRule() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
})