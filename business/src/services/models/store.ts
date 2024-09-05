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
  type: number; // 1:自营店; 2:代营店
  state: number; // 0：锁定；1：启用
}

/**
 * @description 删除店铺 /shop/remove
 */
export interface IDeleteShopReq {
  id: number;
}

/**
 * @description 锁定/解锁店铺 /shop/update-state
 */
export interface ILockUnLockReq {
  id: number;
  state: boolean;
}

/**
 * @description 查询店铺明细信息 /shop/info
 */
export interface IGetShopDetailsRes {
  id?: number;
  type: number;
  shopName: string;
  address: string;
  lonLat: string; // 经度纬度，使用 “,” 隔开
  phone: string;
  linkman: string;
  introduce: string;
  registerTime: string;
  state: number;
}

/**
 * @description 修改我的店铺信息 /shop/save
 */
export interface IUpdateMyShopReq {
  shopName: string;
  address: string;
  lonLat: string;
  phone: string;
  linkman: string;
  introduce: string;
}
