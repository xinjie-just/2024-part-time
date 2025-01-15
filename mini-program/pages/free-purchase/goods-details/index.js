import Toast from '/@vant/weapp/toast/toast';
import { freePruchaseService } from '../../../services/free-pruchase.js';
import { getPKOrderStage } from '../../../utils/common.js';
import { formatRichText } from '../../../utils/richText';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    paymentMethodShow: false,
    introduction: "",
    detail: {},
    orderId: '',
    orderPrice: 0,
    state: null, // 1:支付竞猜金额 2:玩竞猜游戏 3:玩PK游戏 4:支付剩余金额 5:已完成
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
        introduction: formatRichText(res.introduction)
      });
      console.log("introduction", formatRichText(res.introduction));
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
    if (res.state === 1) {
      this.setData({
        payOrderId: res.payOrderId,
        orderPrice: res.orderPrice || 0,
        paymentMethodShow: true,
      });
    }
  },

  async onConfirm() {
    const res = await getPKOrderStage(this.data.orderId);
    if (res.state === 2) {
      this.setData(
        {
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
