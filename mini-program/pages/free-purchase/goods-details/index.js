import Toast from '/@vant/weapp/toast/toast';
import { freePruchaseService } from '../../../services/free-pruchase.js';
import { getPKOrderStage } from '../../../utils/common.js';
import Dialog from '@vant/weapp/dialog/dialog';

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
    shareCode: '', // 分享 Code
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
        this.initShareData();

        const code = options.shareCode;
        if (!!code?.trim()) {
          const params = { shareCode: code };
          freePruchaseService.saveShareRel(params);
        }
      },
    );
  },

  initShareData() {    
    const params = { id: this.data.id };
    freePruchaseService.createShareCode(params).then((res) => {
      this.setData({ shareCode: res.shareCode });
    });
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
      forbidClick: true,
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
            url: `/pages/payment/digital-guessing/index?source=freePurchase&orderId=${this.data.orderId}`,
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
            url: `/pages/payment/digital-guessing/index?source=freePurchase&orderId=${this.data.orderId}`,
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
  onViewTips() {
    Dialog.confirm({
      title: '',
      message: `支付 ${this.data.detail.guessSmallPrice / 100} 元即可参与 0 元购`,
      showCancelButton: false,
    })
      .then(() => {
        // on confirm
      })
      .catch(() => {
        // on cancel
      });
  },
  // 点击分享
  onShareAppMessage() {
    let img = this.data.detail.img;
    img = img ? (img.startsWith('http') ? img : `https://00goo.com/web/${img}`) : '../images/0yuan.jpg';
    const shareInfo = {
      title: `${this.data.detail.title}`,
      description: `支付 ${this.data.detail.guessSmallPrice / 100} 元即可参与 0 元购`,
      imageUrl: img,
    };
    if (!!this.data.shareCode.trim()) {
      shareInfo.path = `/pages/free-purchase/goods-details/index?shareCode=${this.data.shareCode}`;
    } else {
      shareInfo.path = '/pages/free-purchase/goods-details/index';
    }
    return shareInfo;
  },
});
