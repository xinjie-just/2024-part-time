// components/layout/index.js
import { freePruchaseService } from '../../services/free-pruchase.js';

const interval = 60 * 1000; // 游戏匹配轮训时间间隔，单位毫秒，建议设置 10s 以上

Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    showNotify: false,
    timerId: null,
  },

  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      this.getPKTask();
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
      clearTimeout(this.data.timerId);
    },
    hide() {
      // 组件所在的页面被隐藏时执行
      clearTimeout(this.data.timerId);
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onShowNotify() {
      this.setData({
        showNotify: true,
      });
    },
    onCloseNotify() {
      this.setData({
        showNotify: false,
      });
    },
    getPKTask() {
      freePruchaseService.getPKTask().then((res) => {
        if (res) {
          const hasTask = res.existTask;
          this.setData({
            showNotify: hasTask,
          });
          if (!hasTask) {
            const timerId = setTimeout(() => {
              this.getPKTask();
            }, interval); // 发起轮训，再次游戏匹配
            this.setData({
              timerId,
            });
          }
        }
      });
    },
    onIntoPKField() {
      freePruchaseService.joinGame().then((res) => {
        const { gameType, gamePlayerInfo } = res;
        // 游戏类型(1:石头剪刀布;2:双十拳)
        const gamePlayerInfoStringify = JSON.stringify(gamePlayerInfo);
        if (+gameType === 1) {
          wx.navigateTo({
            url: `/pages/free-purchase/guess-rock-paper-scissors/index?gameInfo=${gamePlayerInfoStringify}`,
          });
        } else {
          wx.navigateTo({
            url: `/pages/free-purchase/guess-double-ten-boxing/index?gameInfo=${gamePlayerInfoStringify}`,
          });
        }
      });
    },
  },
});
