// pages/free-purchase/p-k-field/components/rock-paper-scissors/index.js

import Toast from "/@vant/weapp/toast/toast";
import Dialog from '/@vant/weapp/dialog/dialog';

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
    steps: [
      {
        text: '首先：',
        desc: '请先查看游戏规则',
      },
      {
        text: '然后：',
        desc: '准备好后，点击“开始游戏”，系统将为你匹配对手',
      },
    ],
    icon: {
      rock: {
        default: "/assets/images/free-purchase/rock.png",
        own: "/assets/images/free-purchase/rock-own.png",
        other: "/assets/images/free-purchase/rock-other.png"
      },
      scissor: {
        default: "/assets/images/free-purchase/scissor.png",
        own: "/assets/images/free-purchase/scissor-own.png",
        other: "/assets/images/free-purchase/scissor-other.png"
      },
      paper: {
        default: "/assets/images/free-purchase/paper.png",
        own: "/assets/images/free-purchase/paper-own.png",
        other: "/assets/images/free-purchase/paper-other.png"
      }
    },
    matched: false,
    ownRadio: null,
    otherRadio: null,
    showExplain: false,
    result: 3, // 1 我胜，2 对方胜，3 等待出拳，4 对方思考中
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onStart() {
      Toast({
        type: 'loading',
        message: '正在为您匹配对手...',
        onClose: () => {
          this.setData({
            matched: true
          })
        },
      });
    },
    onExit() {
      Dialog.confirm({
        title: '',
        message: '您确定要退出吗？',
      })
        .then(() => {
          wx.switchTab({
            url: '/pages/free-purchase/index',
          })
        })
        .catch(() => {
          // on cancel
        });
    },
    onSelectFinish() {
      this.setData({
        result: 4,
      });
      Toast({
        type: 'loading',
        message: '对方思考中...',
        onClose: () => {
          this.getWatchReault();
        },
      });
    },
    getWatchReault() {
      Toast({
        type: 'text',
        message: '对方已出拳',
        onClose: () => {
          this.setData({
            result: 2,
            ownRadio: "1",
            otherRadio: "3",
          })
        },
      });
    },
    onViewExplain() {
      this.setData({ showExplain: true });
    },
    onCloseExplain() {
      this.setData({ showExplain: false });
    },
    onChangeOwn(e) {
      this.setData({
        ownRadio: e.detail,
      });
    },
    onChangeOther(e) {
      this.setData({
        otherRadio: e.detail,
      });
    },
  },
})