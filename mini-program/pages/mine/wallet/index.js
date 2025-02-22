import { mineService } from '../../../services/mine.js';

Page({
  data: {
    balance: 0,
    list: [],
    page: {
      total: 0,
      pageIndex: 1,
      pageSize: 10,
    },
    loading: false,
    moreLoading: false,
    hasMoreData: false,
  },
  onLoad() {
    this.getBalance();
    this.getList();
  },
  getBalance() {
    mineService.walletInfo()
      .then((result) => {
        const balance = result.balance ?? 0;
        this.setData({
          balance
        });
      })
  },
  getList() {
    this.setData({
      loading: true
    });
    const params = {
      page: this.data.page.pageIndex,
      pageSize: this.data.page.pageSize
    };
    mineService.walletDetailList(params)
      .then((result) => {
        const newData = result.list;        
        const list = this.data.list.concat(newData);
        this.setData({
          list,
          page: {
            total: result.totalNum ?? 0,
            pageIndex: result.pageNum ?? 1,
            pageSize: result.pageSize ?? 10,
          },
          moreLoading: false,
          hasMoreData: result.totalNum > list.length,
        }, () => {
          // 获取最后一项的位置信息
          wx.createSelectorQuery()
          .select('.tbody') // 选择最后一项
          .boundingClientRect((rect) => {
            if (rect) {
              // 滚动到目标位置
              wx.scrollTo({
                top: 100000, // 目标元素的顶部位置
                duration: 300, // 滚动动画时长
              });
            }
          })
          .exec();
        });
        if (result.totalNum > list.length) {          
          wx.stopPullDownRefresh();
        }
        
        })
      .finally(() => {
        this.setData({
          loading: false
        });
      })
  },
  getMoreList() {
    this.setData({
      page: {
        ...this.data.page,
        pageIndex: this.data.page.pageIndex + 1,
      },
      moreLoading: true
    }, () => {
      this.getList();
    })
  },
});