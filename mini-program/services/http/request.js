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

const doRequest = (options) => {
  const promise = new Promise(function (resolve, reject) {
    // 默认所有后端接口都要带 token
    options.data = options.data || {};
    const params = {};
    const headerParams = {
      'Content-Type': options.contentType || 'application/json', // 默认值 "application/json"
    };
    const userInfo = wx.getStorageSync('userInfo');
    if (!options.ignoreToken && userInfo.token) {
      params.token = userInfo.token;
      headerParams['token'] = params.token;
    }

    const requestParams = Object.assign(params, options.data || {});
    if (requestParams.scene == 1154) {
      headerParams['scene'] = 1154;
    }
    const urlPath = API.getAPIUrl(options);
    wx.request({
      url: urlPath,
      method: options.method || 'POST',
      header: headerParams,
      data: requestParams,
      dataType: 'json',
      responseType: 'text',
      success: (data) => {
        const result = data.data || {};
        if (result.code === '200') {
          resolve(result);
        } else if (result.code == '400') {
          // 用户未登录，跳转登录
          wx.navigateTo({
            url: '/pages/user/login/index',
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
          reject(result);
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
        reject(err);
      },
    });
  });
  return promise;
};
export default doRequest;
