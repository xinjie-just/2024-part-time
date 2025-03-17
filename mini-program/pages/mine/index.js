const menuData = [
  // [
  //   {
  //     title: '订单',
  //     url: './order/index',
  //     type: 'order',
  //   },
  // ],
  [
    {
      title: '积分',
      url: './points/index',
      type: 'point',
    },
    {
      title: '钱包',
      url: './wallet/index',
      type: 'wallet',
    },
  ],
  [
    {
      title: '申请成为 PK 手',
      url: './toBecomePKer/index',
      type: 'toBecomePKer',
    },
  ],
  [
    // {
    //   title: '我的地址',
    //   url: './address/index',
    //   type: 'address',
    // },
    {
      title: '如何获得积分',
      url: './how-to-earn-points/index',
      type: 'how-to-earn-points',
    },
    {
      title: '商务合作',
      url: './about/index',
      type: 'about',
    },
  ],
  [
    // {
    //   title: '帮助中心',
    //   url: './help-center/index',
    //   type: 'help-center',
    // },
    {
      title: '客服热线',
      type: 'service',
      icon: 'service-o',
    },
  ],
];

const phone = '13111888207'; // 客服电话号码
const serviceTime = '每周一至周五 09:00-12:00  13:00-18:00'; // 服务时间

Page({
  data: {
    showMakePhone: false,
    avatarUrl: '/assets/images/mine/icon-user-avatar@2x.png',
    nickName: '',
    menuData,
    customerServiceInfo: {},
    currAuthStep: 1, // 1: 未登录的情况，2: 已登录但未授权用户信息情况，3: 已登录且已经授权用户信息的情况
    showKefu: true,
    serviceTimeDuration: serviceTime
  },

  onLoad() {
    // this.getUserInfo();
  },

  onShow() {
    this.getUserInfo();
  },

  getUserInfo() {
    const userInfoStringify = wx.getStorageSync('userInfo');
    if (!userInfoStringify) {
      this.setData({
        nickName: ''
      });
    } else {
      const userInfo = JSON.parse(userInfoStringify);
      this.setData({
        avatarUrl: userInfo.headIcon,
        nickName: userInfo.memberName
      });
    }
  },

  onGoLogin() {
    wx.navigateTo({
      url: '/pages/login/index',
    });
  },

  call() {
    wx.makePhoneCall({
      phoneNumber: phone,
    });
  },

  onClickCell({ currentTarget }) {
    const { type, url } = currentTarget.dataset.item;
    if (type !== 'service') {
      wx.navigateTo({ url });
    } else {
      this.openMakePhone();
    }
  },

  jumpNav(e) {
    const status = e.detail.tabType;

    if (status === 0) {
      wx.navigateTo({ url: '/pages/order/after-service-list/index' });
    } else {
      wx.navigateTo({ url: `/pages/order/order-list/index?status=${status}` });
    }
  },

  openMakePhone() {
    this.setData({ showMakePhone: true });
  },

  closeMakePhone() {
    this.setData({ showMakePhone: false });
  },
});
