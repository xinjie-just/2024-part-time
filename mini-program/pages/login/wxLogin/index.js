// pages/login/wxLogin/index.js
import { loginService } from '../../../services/login.js';
import { jumpExitPage } from '../../../utils/jumpUrl.js';
import { commonService } from '../../../services/common.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.wxLogin();
  },

  wxLogin() {
    this.setData({
      loading: true,
    });
    wx.login({
      success: (res) => {
        if (res.code) {
          //发起网络请求
          const params = {
            code: res.code,
          };
          loginService
            .wxLogin(params)
            .then((result) => {
              const { token } = result;
              wx.setStorageSync('token', token);
              this.getUserInfo();
            })
            .catch((error) => {
              wx.showToast({
                icon: 'error',
                title: error.message || '登陆失败',
              });
              this.setData({
                loading: false,
              });
            });
        } else {
          wx.showToast({
            icon: 'error',
            title: error.message || '登陆失败',
          });
        }
      },
      fail: () => {
        this.setData({
          loading: false,
        });
      },
    });
  },

  getUserInfo() {
    commonService
      .getUserInfo()
      .then((result) => {
        wx.setStorageSync('userInfo', JSON.stringify(result));
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          success: () => {
            jumpExitPage();
          },
        });
      })
      .catch((error) => {
        wx.showToast({
          icon: 'error',
          title: error.message || '获取用户信息失败',
        });
      })
      .finally(() => {
        this.setData({
          loading: false,
        });
      });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
