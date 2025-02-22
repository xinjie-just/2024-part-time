import { mineService } from '../../../services/mine.js';

Page({
  data: {
    pointTotal: 0,
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
    this.getPointTotal();
    this.getList();
  },
  getPointTotal() {
    mineService.pointTotal()
      .then((result) => {
        const totalIntegral = result.totalIntegral ?? 0;
        this.setData({
          pointTotal: totalIntegral
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
    mineService.pointDetailList(params)
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
