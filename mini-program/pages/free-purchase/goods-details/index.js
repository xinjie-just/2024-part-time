import Toast from '/@vant/weapp/toast/toast';
import { freePruchaseService } from '../../../services/free-pruchase.js';
import { getPKOrderStage } from '../../../utils/common.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    paymentMethodShow: false,
    introduction: '',
    detail: {},
    orderId: '',
    orderPrice: 0,
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
        introduction: res.introduction,
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
          orderId: res.orderId, // 订单 ID
        },
        () => {
          this.getPKOrderStageFn();
        },
      );
    });
  },

  // 获取订单阶段
  async getPKOrderStageFn() {
    const res = await getPKOrderStage(this.data.orderId);
    if (res.stage === 1) {
      this.setData({
        stage: 1,
        payOrderId: res.payOrderId,
        orderPrice: res.orderPrice || 0,
        paymentMethodShow: true,
      });
    } else if (res.stage === 2) {
      this.setData(
        {
          stage: 2,
          paymentMethodShow: false,
        },
        () => {
          wx.redirectTo({
            url: `../../payment/digital-guessing/index?source=freePurchase&orderId=${this.data.orderId}`,
          });
        },
      );
    }
  },

  async onConfirm() {
    const res = await getPKOrderStage(this.data.orderId);
    if (res.stage === 2) {
      this.setData(
        {
          stage: 2,
          paymentMethodShow: false,
        },
        () => {
          wx.redirectTo({
            url: `../../payment/digital-guessing/index?source=freePurchase&orderId=${this.data.orderId}`,
          });
        },
      );
    }
  },

  onClose() {
    this.setData({
      paymentMethodShow: false,
    });
  },
});
