// index.ts
// 获取应用实例
const app = getApp<IAppOption>();

Page({
  data: {
    value: 'freePurchase',
    list: [
      { value: 'freePurchase', label: '0 元购', icon: 'discount' },
      { value: 'wishingWell', label: '许愿池', icon: 'root-list' },
      { value: 'mine', label: '我的', icon: 'user' },
    ],
  },
  onChange(e: IEvent) {
    console.log(e.detail.value);
    this.setData({
      value: e.detail.value,
    });
  },
})
