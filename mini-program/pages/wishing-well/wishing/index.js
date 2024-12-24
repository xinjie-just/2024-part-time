import Toast from '/@vant/weapp/toast/toast';
import Dialog from '/@vant/weapp/dialog/dialog';
import wishes from './data';
import { wishingWellService } from '../../../services/wishing-well.js';

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
    wishes,
    wishesOptions: [],
    showOptions: false,
    paymentMethodShow: false,
    orderNumber: "",
    orderPrice: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },

  onChangeTitle(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
    const word = event.detail;
    const params = { word };
    wishingWellService.wishingSuggestList(params)
      .then(result => {
        console.log("onChangeTitle---result", result);
        this.setData({
          showOptions: true,
          wishesOptions: word ? result : []
        });
      })
    // const options = wishes.filter((item) => item.wishName.includes(wishName));
    // this.setData({
    //   showOptions: true,
    //   wishesOptions: wishName ? options : [],
    // });
  },

  onChangeMessage(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
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
    console.log('wishName', this.data.wishName);
    console.log('message', this.data.message);
    wx.showToast({
      title: '创建心愿订单',
      icon: 'loading'
    });
    if (this.data.wishId === null || this.data.wishId === undefined) {
      const createWishingParams = {
        wishName: this.data.wishName
      };
      wishingWellService.createWishing(createWishingParams)
        .then(result => {
          const wishId = result.id;
          const createWishingOrderParams = { wishId };
          wishingWellService.createWishingOrder(createWishingOrderParams)
            .then(res => {
              const orderNumber = res.orderNumber;
              const orderPrice = res.price;
              this.setData({
                wishId,
                orderNumber,
                orderPrice,
                paymentMethodShow: true,
              });
            })
        })
    } else {
      const params = { wishId: this.data.wishId };
      wishingWellService.createWishingOrder(params)
        .then(res => {
          const orderNumber = res.orderNumber;
          const orderPrice = res.price;
          this.setData({
            wishId,
            orderNumber,
            orderPrice,
            paymentMethodShow: true,
          });
        })
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
  onReady() { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() { },
});
