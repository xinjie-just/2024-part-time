// pages/login/index.js
import { loginService } from '../../services/index.js';
import Dialog from '/@vant/weapp/dialog/dialog';
import Toast from '/@vant/weapp/toast/toast';
import { encryption } from "../../utils/encryptor.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: "",
    password: "",
    loading: false
  },

  onChangeUsername(e) {
    const value = e.detail;
    this.setData({
      username: value
    });
  },

  onChangePassword(e) {
    const value = e.detail;
    this.setData({
      password: value
    });
  },

  onBack() {
    Dialog.confirm({
      title: '',
      message: '您确认要返回吗？',
    })
      .then(() => {
        wx.navigateBack();
      })
      .catch(() => {
        // on cancel
      });
  },

  onLogin() {
    const params = {
      loginName: this.data.username,
      password: encryption(this.data.password)
    };
    this.setData({
      loading: true
    });
    loginService.login(params)
      .then((result) => {
        const token = result.token;
        wx.setStorageSync('token', token);
        this.setData({
          loading: false
        });
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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