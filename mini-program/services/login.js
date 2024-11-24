import request from "./request";
export const loginService = {
  // 用户名密码登录
  login(params) {
    return request({
      'apiKey': 'passwordLogin',
      'data': params
    });
  },
};