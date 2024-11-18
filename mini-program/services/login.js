import request from "./http/request";
export const loginService = {
  // 用户名密码登录
  login(params) {
    request({
      'apiKey': 'passwordLogin',
      'data': params
    });
  },
};