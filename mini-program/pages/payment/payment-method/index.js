Component({
  /**
   * 页面的初始数据
   */
  properties: {
    hidePoints: false
  },

  data: {
    radio: 'point',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) { },

  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },

  onClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      radio: name,
    });
  },

  methods: {
    onConfirm() {
      this.triggerEvent('confirm');
    },
    onGoBack() {
      this.triggerEvent('close');
    },
  },
});
