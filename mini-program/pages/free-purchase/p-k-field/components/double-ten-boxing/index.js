// pages/free-purchase/p-k-field/components/double-ten-boxing/index.js
Component({
  options: {
    styleIsolation: 'shared',
  },

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onExit() {
      wx.switchTab({
        url: '/pages/free-purchase/index',
      })
    }
  }
})