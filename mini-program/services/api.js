// 接口地址
const API = {
  address: {
    'wxLogin': '/login-wechat', // 微信登录
    'passwordLogin': '/login-pw', // 账号密码登录
    'pointTotal': '/integral/info', // 获取用户积分信息
    'pointDetailList': '/integral/detail-list', // 获取用户积分明细列表
    'walletInfo': '/wallet/info', // 获取用户钱包信息
    'walletDetailList': '/wallet/detail-list', // 获取用户钱包明细列表
    'PKList': '/product-pk/list', // 获取PK商品信息列表
    'PKDetail': '/product-pk/detail', // 获取PK商品详细信息
    'wishingSuggestList': '/product-wish/suggest-list', // 获取推荐的心愿列表
    'wishingRecord': '/product-wish/record-list', // 查询用户的历史心愿
  },
  getAPIUrl: (options) => {
    const origin = "https://00goo.com/program";
    let route = API.address[options.apiKey];
    let result = `${origin}${route}`;
    return result;
  }
};

export default API;
