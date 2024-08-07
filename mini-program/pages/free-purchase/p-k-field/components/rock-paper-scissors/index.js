// pages/free-purchase/p-k-field/components/rock-paper-scissors/index.js

import Toast from "/@vant/weapp/toast/toast";

Component({
  options: {
    styleIsolation: 'shared',
  },

  /**
   * 组件的属性列表
   */
  // properties: {

  // },

  /**
   * 组件的初始数据
   */
  data: {
    showExplain: false,
    result: 3, // 1 我胜，2 对方胜，3 等待出拳，4 对方思考中
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onExit() {
      wx.switchTab({
        url: '/pages/free-purchase/index',
      })
    },
    onSelectFinish() {
      this.setData({
        reslut: 4,
      });
      Toast({
        type: 'loading',
        message: '对方思考中...',
        onClose: () => {
          Toast({
            type: 'text',
            message: '对方已出拳',
            onClose: () => {
              this.setData({
                reslut: 1
              })
            },
          });
        },
      });
    },
    onViewExplain() {
      this.setData({ showExplain: true });
    },
    onCloseExplain() {
      this.setData({ showExplain: false });
    },
  }
})