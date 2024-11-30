// pages/login/wxLogin/index.js
import { loginService } from '../../../services/login.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.wxLogin();
  },

  wxLogin() {
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          const params = {
            code: res.code
          };
          loginService.wxLogin(params)
            .then((result) => {
              const token = result.token;
              wx.setStorageSync('token', token);
              Toast({
                type: 'success',
                message: '登录成功',
                onClose: () => {
                  wx.navigateBack();
                },
              });
            })
            .catch((error) => {
              Toast({
                type: 'fail',
                message: error.message || '登陆失败'
              });
            })
            .finally(() => {
              this.setData({
                loading: false
              });
            })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
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