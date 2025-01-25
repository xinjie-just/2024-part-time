import { freePruchaseService } from '../../services/free-pruchase.js';
import Dialog from '@vant/weapp/dialog/dialog';

Page({
  data: {
    totalPoints: 300,
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
    this.getList(false);
  },
  getList(more) {
    if (this.timerId != null) {
      clearTimeout(this.timerId);
    }
    if (this.moreTimerId != null) {
      clearTimeout(this.moreTimerId);
    }
    this.setData({
      loading: true,
    });
    const params = {
      page: this.data.page.pageIndex,
      pageSize: this.data.page.pageSize,
    };
    freePruchaseService
      .getPKList(params)
      .then((result) => {
        this.setData(
          {
            list: result.list ?? [],
            page: {
              total: result.totalNum ?? 0,
              pageIndex: result.pageNum ?? 1,
              pageSize: result.pageSize ?? 10,
            },
          },
          () => {
            const page = this.data.page;
            const currentPageData = this.data.list.filter(
              (_, index) => index < page.pageIndex * page.pageSize && index >= (page.pageIndex - 1) * page.pageSize,
            );
            if (more) {
              this.setData({
                moreLoading: true,
              });
              this.moreTimerId = setTimeout(() => {
                const data = this.data.list.concat(currentPageData);
                this.setData(
                  {
                    list: data,
                    moreLoading: false,
                  },
                  () => {
                    this.setData({
                      hasMoreData: page.total > this.data.list.length,
                    });
                  },
                );
              }, 2000);
            } else {
              this.setData({
                loading: true,
              });
              this.timerId = setTimeout(() => {
                this.setData(
                  {
                    list: currentPageData,
                    loading: false,
                  },
                  () => {
                    this.setData({
                      hasMoreData: page.total > this.data.list.length,
                    });
                  },
                );
                wx.stopPullDownRefresh();
              }, 2000);
            }
          },
        );
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
        this.getList(true);
      },
    );
  },
  onViewDetails(e) {
    const data = e.currentTarget.dataset;
    const { id } = data;
    wx.navigateTo({
      url: `./goods-details/index?id=${id}`,
    });
  },
  onToPKField() {
    wx.redirectTo({
      url: '../common/p-k-field/index',
    });
  },

  onViewTips(e) {
    const data = e.currentTarget.dataset;
    const { smallPrice } = data;
    Dialog.confirm({
      title: '',
      message: `支付 ${smallPrice} 元即可参与 0 元购`,
      showCancelButton: false,
    })
      .then(() => {
        // on confirm
      })
      .catch(() => {
        // on cancel
      });
  },
});
