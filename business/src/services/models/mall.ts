/**
 * @description 订单管理-PK 品-订单列表 /product-pk-order/list
 */
export interface IGetPKOrderListReq {
  orderNumber: string; //	订单编号
  productName: string; //	PK品名称
  userPhone: string; //	用户手机号码
  playerPhone: string; //	pK手手机号码
  freeGift: boolean; // 免费赠送
  deliverGoods: boolean; // 发货状态
}
export interface IGetPKOrderListRes {
  totalNum: number;
  list: IPKOrderList[];
}
export interface IPKOrderList {
  id: number; // 订单ID
  orderNumber: string; // 订单编号
  productName: string; // 商品名称
  userPhone: string; // 用户手机号
  playerPhone: string; // PK手手机号
  guessSmallPrice: number; // 竞猜小价
  price: number; // 商品原价
  freeGift: boolean; // 免费赠送
  deliverGoods: boolean; // 发货状态
}

/**
 * @description 订单管理-PK 品-订单发货 /product-pk-order/deliver-goods
 */
export interface IPKOrderShippingReq {
  orderId: 1; // 订单 ID
}

/**
 * @description 订单管理-PK 品-订单退货 /product-pk-order/sales-return
 */
export interface IPKOrderReturnsReq {
  orderId: 1; // 订单 ID
}

/**
 * @description 订单管理-扫一扫-订单列表 /product-scan-order/list
 */
export interface IGetScanOrderListReq {
  orderNumber: string; //	订单编号
  productName: string; //	扫一扫商品名称
  userPhone: string; //	用户手机号码
  freeGift: boolean; // 免费赠送
}
export interface IGetScanOrderListRes {
  totalNum: number;
  list: IScanOrderList[];
}
export interface IScanOrderList {
  id: number; // 订单ID
  orderNumber: string; // 订单编号
  productName: string; // 商品名称
  userPhone: string; // 用户手机号
  price: number; // 商品价格
  freeGift: boolean; // 免费赠送
}

/**
 * @description 订单管理-创意许愿-订单列表 /product-wish-order/list
 */
export interface IGetWishingOrderListReq {
  orderNumber: string; //	订单编号
  productName: string; //	创意许愿商品名称
  userPhone: string; //	用户手机号码
  wishResult: boolean; // 许愿结果
}
export interface IGetWishingOrderListRes {
  totalNum: number;
  list: IWishingOrderList[];
}
export interface IWishingOrderList {
  id: number; // 订单ID
  orderNumber: string; // 订单编号
  productName: string; // 创意许愿商品名称
  userPhone: string; // 用户手机号
  minPrice: number; // 小金额
  maxPrice: number; // 大金额
  wishResult: boolean; // 许愿结果
}
