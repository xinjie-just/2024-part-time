// 接口地址
const API = {
  address: {
    user: {
      'wxLogin': '/login-wechat', // 微信登录
      'passwordLogin': '/login-pw', // 账号密码登录
    },
    mine: {
      'pointInfo': '/integral/info', // 获取用户积分信息
      'pointDetailList': '/integral/detail-list', // 获取用户积分明细列表
      'walletInfo': '/wallet/info', // 获取用户钱包信息
      'walletDetailList': '/wallet/detail-list', // 获取用户钱包明细列表
    },
    freePurchase: {
      'PKList': '/product-pk/list', // 获取PK商品信息列表
      'PKDetail': '/product-pk/detail', // 获取PK商品详细信息
    },
    wishing: {
      'wishingSuggestList': '/product-wish/suggest-list', // 获取推荐的心愿列表
      'wishingRecord': '/product-wish/record-list', // 查询用户的历史心愿
    },
  },
  getAPIUrl: (options) => {
    const origin = "http://5011a2d4.r27.cpolar.top/program/";
    let route = API.address[options.module][options.apiKey];
    let result = `${origin}${route}`;
    return result;
  }
};

export default API;
