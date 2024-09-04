/**
 * @description 修改店铺密码 /shop/save-pass-word
 */
export interface IUpdatePasswordReq {
  id: string;
  oldPassWord: string;
  newPassWord: string;
}

/**
 * @description 查询代营店铺列表 /shop/shop-proxy-list
 */
export interface IGetAgentShopListReq {
  name: string;
}
export interface IGetAgentShopListRes {
  totalNum: number;
  list: IAgentShopList[];
}
export interface IAgentShopList {
  id: string;
  name: string;
  phone: string;
  registerTime: string;
  type: number;
  state: number;
}

// IDeleteShopReq

/**
 * @description 删除店铺 /shop/remove
 */
export interface IDeleteShopReq {
  id: number;
}
