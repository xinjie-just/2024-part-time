import list from "./data.js";

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
    this.timerId = null;
    this.moreTimerId = null;
    this.getList(false)
  },
  getList(more) {
    if (this.timerId != null) {
      clearTimeout(this.timerId);
    }
    if (this.moreTimerId != null) {
      clearTimeout(this.moreTimerId);
    }
    const page = this.data.page;
    const currentPageData = list.filter((_, index) => index < page.pageIndex * page.pageSize && index >= (page.pageIndex - 1) * page.pageSize);
    if (more) {
      this.setData({
        moreLoading: true
      });
      this.moreTimerId = setTimeout(() => {
        const data = this.data.list.concat(currentPageData);
        this.setData({
          list: data,
          moreLoading: false
        }, () => {
          this.setData({
            hasMoreData: list.length > this.data.list.length
          });
        })
      }, 2000)
    } else {
      this.setData({
        loading: true
      });
      this.timerId = setTimeout(() => {
        this.setData({
          list: currentPageData,
          loading: false
        }, () => {
          this.setData({
            hasMoreData: list.length > this.data.list.length
          });
        });
        wx.stopPullDownRefresh();
      }, 2000)
    }
  },
  getMoreList() {
    this.setData({
      page: {
        ...this.data.page,
        pageIndex: this.data.page.pageIndex + 1,
      },
      moreLoading: true
    }, () => {
      this.getList(true);
    })
  },

  onToWishing() {
    wx.navigateTo({
      url: './wishing/index'
    })
  },
});