import Toast from '/@vant/weapp/toast/toast';
import { mineService } from '../../../services/mine.js';
import { commonService } from '../../../services/common.js';

const codeInterval = 60; // 获取验证码间隔时间，单位秒，建议 60 秒或 120 秒

Page({
  /**
   * 页面的初始数据
   */
  data: {
    cuntDown: codeInterval,
    phone: "",
    code: "",
    codeKey: "",
    hasBeenSent: false,
    phoneDisabled: true,
    codeDisabled: true,
    disabled: false,
    loading: false,
    isPkPlayer: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {  },

  onChangePhone(e) {
    const value = e.detail.trim();
    this.setData({
      phone: value,
      phoneDisabled: !/^1[3456789]\d{9}$/.test(value),
    });
  },

  onChangeCode(e) {
    const value = e.detail.trim();
    this.setData({
      code: value,
      codeDisabled:!/^\d{6}$/.test(value),
    });
  },

  onSendCode() {
    if (this.data.phoneDisabled) {
      return;
    }
    this.setCountdown();
    const params = {
      phone: this.data.phone,
    };
    this.setData({
      hasBeenSent: true
    });
    commonService.sendCode(params)
      .then((result) => {
        this.setData({
          codeKey: result.codeKey,
        });
        Toast({
          type:'success',
          message: '验证码已发送',
          cuntDown: 2000,
        });
      })
      .finally(() => {
        this.setData({
          loading: false
        });
      })
  },

  setCountdown() {
    let cuntDown = this.data.cuntDown;
    const timer = setInterval(() => {
      cuntDown--;
      this.setData({
        cuntDown,
      });
      if (cuntDown <= 0) {
        clearInterval(timer);
        this.setData({
          cuntDown: codeInterval,
          hasBeenSent: false
        });
      }
    }, 1000);
  },

  onToBecomePKer() {
    const params = {
      phone: this.data.phone,
      code: this.data.code,
      codeKey: this.data.codeKey,
    };
    this.setData({
      loading: true
    });
    mineService.toBecomePKer(params)
      .then(() => {        
        const userInfoStringify = wx.getStorageSync('userInfo');
        if (userInfoStringify) {
          const params = {
            ...JSON.parse(userInfoStringify),
            isPkPlayer: true, 
          };
          wx.setStorageSync('userInfo', JSON.stringify(params));
        }
        Toast({
          type: 'success',
          message: '提交成功，恭喜您已成为PK手',
          cuntDown: 3000,
          onClose: () => {
            wx.navigateBack();
          },
        });
      })
      .finally(() => {
        this.setData({
          loading: false
        });
      })
  },

  onBack() {
    wx.navigateBack(); 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {    
    const userInfoStringify = wx.getStorageSync('userInfo');
    if (userInfoStringify) {
      const params = JSON.parse(userInfoStringify);
      this.setData({
        isPkPlayer: params.isPkPlayer
      });
    }
  },

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
