Page({
  /**
   * 页面的初始数据
   */
  data: {
    steps: [
      {
        text: '首先：',
        desc: '请先查看游戏规则',
      },
      {
        text: '然后：',
        desc: '准备好后，选择一种游戏，点击“开始游戏”，系统将为你匹配对手',
      },
    ],
    show: false,
    rpsUrl: '',
    dtbUrl: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const orderId = +options.orderId;
    this.setData({
      rpsUrl: `../guess-rock-paper-scissors/index?orderId=${orderId}`,
      dtbUrl: `../guess-double-ten-boxing/index?orderId=${orderId}`,
    });
  },
  onShowRule() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
});
