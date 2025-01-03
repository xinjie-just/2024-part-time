import Dialog from '/@vant/weapp/dialog/dialog';
import Toast from '/@vant/weapp/toast/toast';
import { wishingWellService } from '../../../services/wishing-well.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    productId: null,
    orderId: null,
    result: null, // 猜中 true，未猜中 false
    rightAnswer: [], // 谜底
    activeNames: [],
    digit: 5,
    numbers: [], // 我猜的数
    paymentMethodShow: false,
    source: 'wishing', // 'wishing'：许愿，'freePurchase'：0 元购
    state: 1, // 1: "游戏进行中", 2: "游戏结束", 3: "游戏超时"
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
        this.getWishingGuessInfo();
      },
    );
  },

  getWishingGuessInfo() {
    const params = {
      orderId: this.data.orderId,
    };
    wishingWellService.getWishingGuessInfo(params).then((res) => {
      console.log('getWishingGuessInfo---res', res);
      const digit = res.guessDigit;
      const state = res.state; // TODO: 如果游戏不是进行中，则一些操作不可用
      this.setData({
        digit,
        numbers: new Array(digit).fill(5),
        rightAnswer: new Array(digit).fill('-'),
      });
    });
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },

  getRandomNumbers() {
    let numbers = [];
    for (let i = 0; i < this.data.digit; i++) {
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
    const numbers = this.data.numbers;
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
      message: `确认我猜的数从第 1 - ${this.data.digit} 位分别是：${this.data.numbers.join('、 ')}`,
    })
      .then(() => {
        // 提交竞猜
        const params = {
          orderId: this.data.orderId,
          guessSubmitAnswer: this.data.numbers.join(''),
        };
        wishingWellService.submitWishingGuess(params).then((res) => {
          console.log('submitWishingGuess---res', res);
          this.setData({
            rightAnswer: res.guessAnswer,
            result: res.result,
          });
        });
      })
      .catch(() => {});
  },

  onToPK() {
    wx.redirectTo({
      url: '/pages/free-purchase/p-k-field/index',
    });
  },

  onContinue() {
    this.setData({
      result: null,
      rightAnswer: new Array(this.data.digit).fill('-'),
    });
  },

  onBuy() {
    this.setData({
      paymentMethodShow: true,
    });
  },

  onConfirm() {
    this.setData({
      paymentMethodShow: false,
    });
  },

  onClose() {
    this.setData({
      paymentMethodShow: false,
    });
  },

  onExit() {
    wx.switchTab({
      url: '/pages/wishing-well/index',
    });
  },
});
