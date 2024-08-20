// pages/payment/digital-guessing/index.js
import Dialog from '/@vant/weapp/dialog/dialog';
import Toast from '/@vant/weapp/toast/toast';
import { areArraysEqual } from '../../../utils/util';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    results: {
      1: '未显示谜底',
      2: '猜中',
      3: '未猜中',
    },
    result: '1',
    businessNumbers: [],
    activeNames: [],
    digit: 5,
    numbers: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      numbers: new Array(this.data.digit).fill(5),
      businessNumbers: new Array(this.data.digit).fill('-'),
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
        this.setData({
          businessNumbers: this.getRandomNumbers(),
        });
        Toast({
          type: 'loading',
          message: '正在比较结果',
          onClose: () => {
            // this.setData({ // TODO:
            //   result: areArraysEqual(this.data.numbers, this.data.businessNumbers) ? '2' : '3'
            // });
            this.setData({
              result: '3',
            });
          },
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
      result: '1',
      businessNumbers: new Array(this.data.digit).fill('-'),
    });
  },

  onBuy() {
    wx.navigateTo({
      url: '/pages/payment/payment-method/index',
    });
  },
});
