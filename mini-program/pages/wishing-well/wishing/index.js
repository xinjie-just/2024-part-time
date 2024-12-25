import Toast from '/@vant/weapp/toast/toast';
import Dialog from '/@vant/weapp/dialog/dialog';
import { wishingWellService } from '../../../services/wishing-well.js';
import _ from 'lodash';

// pages/wishing-well/wishing/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shopId: null,
    wishId: null,
    wishName: '',
    message: '',
    wishesOptions: [],
    showOptions: false,
    paymentMethodShow: false,
    orderNumber: '',
    orderPrice: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.debouncedSearch = _.debounce(this.search, 800);
  },

  onChangeTitle(event) {
    const word = event.detail;
    this.debouncedSearch(word);
  },

  search(word) {
    const params = { word };
    wishingWellService.wishingSuggestList(params).then((result) => {
      this.setData({
        showOptions: true,
        wishesOptions: word ? result : [],
      });
    });
  },

  onSelectedWish(e) {
    const { wishId, wishName, shopId } = e.currentTarget.dataset;
    this.setData({
      wishName: wishName,
      shopId: shopId,
      wishId: wishId,
      showOptions: false,
    });
  },

  onBlurTitle() {
    this.setData({
      showOptions: false,
    });
  },

  onFocusTitle() {
    const options = this.data.wishesOptions.filter((item) => item.wishName.includes(this.data.wishName));
    this.setData({
      showOptions: true,
      wishesOptions: this.data.wishName ? options : [],
    });
  },

  onSave() {
    Toast({
      type: 'loading',
      message: '创建心愿订单',
    });
    if (this.data.wishId === null || this.data.wishId === undefined) {
      const createWishingParams = {
        wishName: this.data.wishName,
        introduction: this.data.message,
      };
      wishingWellService.createWishing(createWishingParams).then((result) => {
        const wishId = result.id;
        const createWishingOrderParams = { wishId };
        wishingWellService.createWishingOrder(createWishingOrderParams).then((res) => {
          Toast.clear();
          const orderNumber = res.orderNumber;
          const orderPrice = res.price || 0;
          this.setData({
            wishId,
            orderNumber,
            orderPrice,
            paymentMethodShow: true,
          });
        });
      });
    } else {
      const params = { wishId: this.data.wishId };
      wishingWellService.createWishingOrder(params).then((res) => {
        Toast.clear();
        const orderNumber = res.orderNumber;
        const orderPrice = res.price || 0;
        this.setData({
          wishId: this.data.wishId,
          orderNumber,
          orderPrice,
          paymentMethodShow: true,
        });
      });
    }
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
      paymentMethodShow: false,
    });
    Toast({
      type: 'success',
      message: '支付成功',
      onClose: () => {
        wx.redirectTo({
          url: `../../payment/digital-guessing/index?source=wishing&productId=${this.data.wishId}`,
        });
      },
    });
  },

  onClose() {
    this.setData({
      paymentMethodShow: false,
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
