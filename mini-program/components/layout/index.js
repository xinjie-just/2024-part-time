// components/layout/index.js
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
  },
});
