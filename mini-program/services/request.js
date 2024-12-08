import API from './api';
// 常见错误码
const ErrorCode = {
  400: '未登录',
  401: '访问未授权',
  403: '访问被拒绝',
  404: '请求地址有误',
  405: '访问被拒绝(405)',
  500: '服务器发生错误,请稍后再试',
  502: '请求失败，请稍后再试',
  503: '服务不可用',
  504: '网关超时',
  505: '不支持所请求http协议版本',
  '-1': '请求失败,请检查您的网络设置',
};
// 发起请求

const request = (options) => {
  return new Promise((resolve, reject) => {
    // 默认所有后端接口都要带 token（用户名密码登录除外）
    options.data = options.data || {};
    const params = {};
    const headerParams = {
      'Content-Type': options.contentType || 'application/json', // 默认值 "application/json"
    };
    const token = wx.getStorageSync('token');
    if (!options.ignoreToken && token) {
      headerParams['token'] = token;
    }

    const requestParams = Object.assign(params, options.data || {});
    if (requestParams.scene == 1154) {
      headerParams['scene'] = 1154;
    }
    const urlPath = API.getAPIUrl(options);
    wx.request({
      url: urlPath,
      method: options.method ?? 'POST',
      header: headerParams,
      data: requestParams,
      dataType: 'json',
      responseType: 'text',
      success: (data) => {
        const result = data.data || {};
        if (result.code === 200) {
          return resolve(result.data);
        } else if (result.code == 400) {
          const pages = getCurrentPages();
          const currentPage = pages[pages.length - 1]; // 获取当前页面实例
          const route = currentPage.route; // 输出当前页面的路由
          wx.setStorageSync('exitPage', route);
          wx.showToast({
            title: '未登录',
            icon: 'error',
            success: () => {
              // 用户未登录，跳转登录
              wx.navigateTo({
                url: '/pages/login/index',
              });
            },
          });
        } else {
          if (result.code && result.errorMsg) {
            wx.showToast({
              icon: 'none',
              title: result.errorMsg,
              duration: 2500,
            });
          } else if (data.statusCode && data.statusCode != 200) {
            wx.showToast({
              icon: 'none',
              title: ErrorCode[data.statusCode],
              duration: 2000,
            });
          }
          return reject(result);
        }
      },
      fail: (err) => {
        console.log(err);
        // 错误提示
        if (!options.ignoreErrorTip) {
          let errorMsg = '请求失败，请稍后再试';
          if (err.statusCode) {
            errorMsg = ErrorCode[err.statusCode];
          } else if (err.errMsg == 'request:fail timeout') {
            errorMsg = '请求超时，请稍后再试';
          }
          wx.showToast({
            icon: 'none',
            title: errorMsg,
            duration: 2000,
          });
        }
        return reject(err);
      },
    });
  });
};
export default request;
