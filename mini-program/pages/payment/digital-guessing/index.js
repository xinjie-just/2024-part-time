import Dialog from '/@vant/weapp/dialog/dialog';
import Toast from '/@vant/weapp/toast/toast';
import { wishingWellService } from '../../../services/wishing-well.js';
import { freePruchaseService } from '../../../services/free-pruchase.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderId: null,
    result: null, // 猜中 true，未猜中 false
    rightAnswer: [], // 谜底
    activeNames: [],
    guessDigit: 5,
    numbers: [], // 我猜的数
    paymentMethodShow: false,
    source: 'wishing', // 'wishing'：许愿，'freePurchase'：0 元购
    state: 1, // 竞猜状态 1:游戏进行中; 2:游戏结束
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData(
      {
        source: options.source,
        orderId: +options.orderId,
      },
      () => {
        this.getGuessInfoFn();
      },
    );
  },

  getGuessInfoFn() {
    const params = {
      orderId: this.data.orderId,
    };
    let request = null;
    if (this.data.source === 'wishing') {
      request = wishingWellService.getWishingGuessInfo(params);
    } else if (this.data.source === 'freePurchase') {
      request = freePruchaseService.getPKGuessInfo(params);
    }
    request.then((res) => {
      const { state, guessDigit } = res;
      this.setData({
        guessDigit,
        state,
        numbers: new Array(guessDigit).fill(5),
        rightAnswer: new Array(guessDigit).fill('-'),
      });
    });
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },

  getRandomNumbers() {
    const numbers = [];
    for (let i = 0; i < this.data.guessDigit; i++) {
      const number = Math.floor(Math.random() * 10);
      numbers.push(number);
    }
    return numbers;
  },

  onProduceRandom() {
    this.setData({
      numbers: this.getRandomNumbers(),
    });
  },

  onChangeStepper(event) {
    const { index } = event.currentTarget.dataset;
    const { numbers } = this.data;
    numbers[index] = event.detail;
    this.setData({
      numbers,
    });
  },

  onShowResult() {
    Dialog.confirm({
      title: '',
      showCancelButton: true,
      cancelButtonText: '再想想',
      message: `确认我猜的数从第 1 - ${this.data.guessDigit} 位分别是：${this.data.numbers.join('、 ')}`,
    })
      .then(() => {
        // 提交竞猜
        const params = {
          orderId: this.data.orderId,
          guessSubmitAnswer: this.data.numbers.join(''),
        };
        if (this.data.source === 'wishing') {
          wishingWellService.submitWishingGuess(params).then((res) => {
            this.setData({
              rightAnswer: res.guessAnswer,
              result: res.result,
            });
          });
        } else if (this.data.source === 'freePurchase') {
          freePruchaseService.submitPKGuess(params).then((res) => {
            this.setData({
              rightAnswer: res.guessAnswer,
              result: res.result,
            });
            this.getPKOrderStageFn();
          });
        }
      })
      .catch(() => {});
  },

  // 获取订单阶段
  async getPKOrderStageFn() {
    const res = await getPKOrderStage(this.data.orderId);
    if (res.state === 2) {
      this.getGuessInfoFn();
    } else if (res.state === 3) {
      wx.redirectTo({
        url: `/pages/free-purchase/guess-p-k-field/index?orderId=${this.data.orderId}`,
      });
    } else if (res.state === 4) {
      this.setData({
        payOrderId: res.payOrderId,
        orderPrice: res.orderPrice,
        paymentMethodShow: true,
      });
    } else if (res.state === 5) {
      this.setData(
        {
          state: 5,
        },
        () => {
          Toast('游戏已结束');
        },
      );
    }
  },

  onToPK() {
    wx.redirectTo({
      url: `/pages/free-purchase/guess-p-k-field/index?orderId=${this.data.orderId}`,
    });
  },

  onContinue() {
    this.setData({
      result: null,
      rightAnswer: new Array(this.data.guessDigit).fill('-'),
    });
  },

  onBuy() {
    this.setData({
      paymentMethodShow: true,
    });
  },

  async onConfirm() {
    const res = await getPKOrderStage(this.data.orderId);
    if (res.state === 2) {
      this.setData(
        {
          paymentMethodShow: false,
        },
        () => {
          this.getGuessInfoFn();
        },
      );
    } else if (res.state === 3) {
      wx.redirectTo({
        url: `/pages/free-purchase/guess-p-k-field/index?orderId=${this.data.orderId}`,
      });
    } else if (res.state === 4) {
      this.setData({
        payOrderId: res.payOrderId,
        orderPrice: res.orderPrice,
        paymentMethodShow: true,
      });
    } else if (res.state === 5) {
      this.setData(
        {
          state: 5,
        },
        () => {
          Toast('游戏已结束');
        },
      );
    }
  },

  onClose() {
    this.setData({
      paymentMethodShow: false,
    });
  },

  onExit() {
    Dialog.confirm({
      title: '',
      message: '您确认要退出吗？',
    }).then(() => {
      wx.switchTab({
        url: '/pages/wishing-well/index',
      });
    });
  },

  // 退出确认
  onBack() {
    wx.navigateBack();
  },

  onBackHome() {
    wx.switchTab({
      url: '/pages/free-purchase/index',
    });
  },
});
