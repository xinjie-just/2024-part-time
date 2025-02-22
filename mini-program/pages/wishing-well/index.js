import { wishingWellService } from '../../services/wishing-well.js';

Page({
  data: {
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
    this.getList();
  },
  getList() {
    this.setData({
      loading: true,
    });
    const params = {
      page: this.data.page.pageIndex,
      pageSize: this.data.page.pageSize,
    };
    wishingWellService
      .getWishingRecord(params)
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
          loading: false,
        });
      });
  },
  getMoreList() {
    this.setData(
      {
        page: {
          ...this.data.page,
          pageIndex: this.data.page.pageIndex + 1,
        },
        moreLoading: true,
      },
      () => {
        this.getList();
      },
    );
  },

  onToWishing() {
    wx.navigateTo({
      url: './wishing/index',
    });
  },
});
