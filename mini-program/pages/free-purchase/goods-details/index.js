import Toast from '/@vant/weapp/toast/toast';
import { freePruchaseService } from '../../../services/free-pruchase.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    paymentMethodShow: false,
    detail: {},
    orderId: '',
    orderPrice: 0,
    state: null, // 1: 支付竞猜金额，2：玩竞猜游戏，3：创建 PK 游戏，4：完 PK 游戏，5：支付剩余金额，6： 已完成
    payOrderId: '', // 支付订单 ID
    orderGameId: '', // 订单游戏 ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData(
      {
        id: +options.id,
      },
      () => {
        this.getPKDetail();
      },
    );
  },

  getPKDetail() {
    const params = {
      id: this.data.id,
    };
    freePruchaseService.getPKDetail(params).then((res) => {
      this.setData({
        detail: res,
      });
    });
  },

  onToSelectPaymentMethod() {
    Toast({
      type: 'loading',
      message: '正在创建订单',
    });
    const params = {
      productPkId: this.data.id,
    };
    freePruchaseService.createPKOrder(params).then((res) => {
      Toast.clear();
      this.setData(
        {
          orderId: res.orderId,
        },
        () => {
          this.getPKOrderInfo();
        },
      );
    });
  },

  // 获取 PK 订单信息
  getPKOrderInfo() {
    Toast({
      type: 'loading',
      message: '正在获取订单信息',
    });
    const params = {
      orderId: this.data.orderId,
    };
    freePruchaseService.getPKOrderInfo(params).then((res) => {
      Toast.clear();
      this.setData({
        orderPrice: res.price || 0,
        state: res.state ?? null,
        payOrderId: res.payOrderId ?? '',
        orderGameId: res.orderGameId ?? '',
        paymentMethodShow: true,
      });
    });
  },

  onConfirm() {
    this.setData(
      {
        paymentMethodShow: false,
      },
      () => {
        wx.redirectTo({
          url: `../../payment/digital-guessing/index?source=freePurchase&productId=${this.data.id}`,
        });
      },
    );
  },

  onClose() {
    this.setData({
      paymentMethodShow: false,
    });
  },
});
