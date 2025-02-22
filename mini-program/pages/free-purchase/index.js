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
    freePruchaseService
      .getPKList(params)
      .then((result) => {
        const newData = result.list.map(item => {
          return {
            ...item,
            img: item.img
              ? (item.img.startsWith('http') ? item.img : `https://00goo.com/web/${item.img}`)
              : '',
          };
        });
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
  onViewDetails(e) {
    const data = e.currentTarget.dataset;
    const { id } = data;
    wx.navigateTo({
      url: `./goods-details/index?id=${id}`,
    });
  },
  onToPKField() {
    wx.redirectTo({
      url: '/pages/common/p-k-field/index',
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
