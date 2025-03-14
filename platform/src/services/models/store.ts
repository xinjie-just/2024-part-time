/**
 * @description 店铺列表 /shop/list
 */
export interface IGetShopListRes {
  id: string; // 店铺 ID
  shopName: string; // 店铺名称
  phone: string; // 联系电话
  type: number; // 店铺类型(1:自营店; 2:代营店)
  state: number; // 店铺状态(0:已锁定; 1:已启用)
}

/**
 * @description 删除店铺 /shop/remove
 */
export interface IDeleteShopReq {
  id: number;
}

/**
 * @description 锁定/解锁店铺 /shop/lock
 */
export interface ILockUnLockReq {
  id: number;
  lockState: number; // 0:已锁定 1:已启用
}

/**
 * @description 添加店铺 /shop/add
 */
export interface IAddShopReq {
  shopName: string; // 店铺名称
  loginName: string; // 登录名
  phone: string; // 手机号
  password: string; // 登录密码
}
