import Toast from "/@vant/weapp/toast/toast";
import Dialog from '/@vant/weapp/dialog/dialog';
import wishes from "./data";

// pages/wishing-well/wishing/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    message: "",
    wishes,
    wishesOptions: [],
    showOptions: false,
    paymentMethodShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.setData({
    //   wishesOptions: wishes
    // })
  },

  onChangeTitle(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
    const title = event.detail;
    const options = wishes.filter(item => item.title.includes(title));
    this.setData({
      showOptions: true,
      wishesOptions: title ? options : [],
    })
  },

  onChangeMessage(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
  },

  onSelectedWish(e) {
    const wish = e.currentTarget.dataset.title;
    this.setData({
      title: wish,
      showOptions: false
    })
  },

  onBlurTitle() {
    this.setData({
      showOptions: false
    })
  },

  onFocusTitle() {
    const options = this.data.wishesOptions.filter(item => item.title.includes(this.data.title));
    this.setData({
      showOptions: true,
      wishesOptions: this.data.title ? options : [],
    })
  },

  onSave() {
    console.log("title", this.data.title);
    console.log("message", this.data.message);
    // wx.navigateTo({
    //   url: '/pages/payment/payment-method/index',
    // })
    this.setData({
      paymentMethodShow: true
    });
  },

  onCancel() {
    Dialog.confirm({
      title: '',
      message: '您确认要放弃吗？',
    })
      .then(() => {
        wx.navigateBack();
      })
      .catch(() => {
        // on cancel
      });
  },

  onConfirm() {
    this.setData({
      paymentMethodShow: false
    });
    Toast({
      type: 'success',
      message: '支付成功',
      onClose: () => {
        wx.redirectTo({
          url: `../../payment/digital-guessing/index?source=wishing`,
        });
      },
    });
  },

  onClose() {
    this.setData({
      paymentMethodShow: false
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})