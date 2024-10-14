/**
 * @description 查询 PK 商品列表 /product-pk/list
 */
export interface IGetPKListReq {
  state?: number; // 商品状态(0:待售; 1:销售中; 2:停止销售)
  name?: string; // 商品名称
  page: number; // 页码
  pageSize: number; // 每页数量
}
export interface IGetPKListRes {
  totalNum: number;
  list: IPKList[];
}
export interface IPKList {
  id: number; // 商品ID
  name: string; // 商品名称
  price: number; // 商品价格
  settlePrice: number; // 商品结算价格
  currentPrice: number; // 商品现在价格
  guessSmallPrice: number; // 竞猜小价
  QRCode?: string; // 二维码
  state: number; // 状态
}

/**
 * @description 查询 PK 品详情 /product-pk/info
 */
export interface IGetPKDetailsRes {
  [key: string]: any;
}

/**
 * @description 新增/编辑 PK 商品 /product-pk/save
 */
export interface ISavePKReq {
  id?: number; // 商品ID
  name: string; // 商品名称
  title: string; // 商品标题
  price: number; // 商品价格
  settlePrice: number; // 结算价格
  currentPrice: number; // 当前价格
  guessDigit: number; // 竞猜位数
  guessSmallPrice: number; // 竞猜小价
  pkNum: number; // PK次数
  introduction: string; // 商品说明
}

/**
 * @description 修改 PK 商品上下线状态 /product-pk/sell
 */
export interface ISetPKStateReq {
  id: number; // 商品ID
  state: number; // 商品状态(0:待售; 1:销售中; 2:停止销售)
}

/**
 * @description 查询扫一扫商品列表 /product-scan/list
 */
export interface IGetScanListReq {
  state?: number; // 商品状态(0:待售; 1:销售中; 2:停止销售)
  name?: string; // 商品名称
  page: number; // 页码
  pageSize: number; // 每页数量
}
export interface IGetScanListRes {
  totalNum: number;
  list: IScanList[];
}
export interface IScanList {
  id: number; // 商品ID
  name: string; // 商品名称
  price: number; // 商品价格
  settlePrice: number; // 商品结算价格
  currentPrice: number; // 商品现在价格
  guessSmallPrice: number; // 竞猜小价
  QRCode?: string; // 二维码
  state: number; // 状态
}

/**
 * @description 查询扫一扫商品详情 /product-scan/info
 */
export interface IGetScanDetailsRes {
  [key: string]: any;
}

/**
 * @description 新增/编辑扫一扫商品 /product-scan/save
 */
export interface ISaveScanReq {
  id?: number; // 商品ID
  name: string; // 商品名称
  title: string; // 商品标题
  price: number; // 商品价格
  settlePrice: number; // 结算价格
  currentPrice: number; // 当前价格
  guessDigit: number; // 竞猜位数
  guessSmallPrice: number; // 竞猜小价
  introduction: string; // 商品说明
}

/**
 * @description 修改扫一扫商品上下线状态 /product-scan/sell
 */
export interface ISetScanStateReq {
  id: number; // 商品ID
  state: number; // 商品状态(0:待售; 1:销售中; 2:停止销售)
}

/**
 * @description 查询创意许愿商品列表 /product-wish/list
 */
export interface IGetWishingListReq {
  state?: number; // 许愿状态(1:可许心愿; 2:停止许愿)
  name?: string; // 商品名称
  page: number; // 页码
  pageSize: number; // 每页数量
}
export interface IGetWishingListRes {
  totalNum: number;
  list: IWishingList[];
}
export interface IWishingList {
  id: number; // 商品ID
  name: string; // 商品名称
  price: number; // 商品价格
  QRCode?: string; // 二维码
  state: number; // 状态
}

/**
 * @description 查询创意许愿商品详情 /product-wish/info
 */
export interface IGetWishingDetailsRes {
  [key: string]: any;
}

/**
 * @description 新增/编辑创意许愿商品 /product-wish/save
 */
export interface ISaveWishingReq {
  id?: number; // 商品ID
  name: string; // 商品名称
  title: string; // 商品标题
  price: number; // 参考价格
  coinDrop: number; // 投币小额
  guessDigit: number; // 竞猜位数
  introduction: string; // 简介
}

/**
 * @description 修改创意许愿商品上下线状态 /product-wish/sell
 */
export interface ISetWishingStateReq {
  id: number; // 心愿ID
  state: number; // 心愿状态(0:待许愿; 1:可许心愿; 2:停止许愿)
}

/**
 * @description 订单管理-PK 品-订单列表 /product-pk-order/list
 */
export interface IGetPKOrderListReq {
  orderNumber?: string; //	订单编号
  productName?: string; //	PK品名称
  userPhone?: string; //	用户手机号码
  playerPhone?: string; //	pK手手机号码
  freeGift?: boolean | null; // 免费赠送
  deliverGoods?: boolean | null; // 发货状态
  page: number; // 页码
  pageSize: number; // 每页数量
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
  orderId: number; // 订单 ID
}

/**
 * @description 订单管理-PK 品-订单退货 /product-pk-order/sales-return
 */
export interface IPKOrderReturnsReq {
  orderId: number; // 订单 ID
}

/**
 * @description 订单管理-PK 品-订单退款 /product-pk-order/refund
 */
export interface IPKOrderRefundReq {
  orderId: number; // 订单 ID
}

/**
 * @description 订单管理-扫一扫-订单列表 /product-scan-order/list
 */
export interface IGetScanOrderListReq {
  orderNumber?: string; //	订单编号
  productName?: string; //	扫一扫商品名称
  userPhone?: string; //	用户手机号码
  freeGift?: boolean | null; // 免费赠送
  page: number; // 页码
  pageSize: number; // 每页数量
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
  freeGift: boolean | string; // 免费赠送
}

/**
 * @description 订单管理-创意许愿-订单列表 /product-wish-order/list
 */
export interface IGetWishingOrderListReq {
  orderNumber?: string; //	订单编号
  productName?: string; //	创意许愿商品名称
  userPhone?: string; //	用户手机号码
  wishResult?: boolean | null; // 许愿结果
  page: number; // 页码
  pageSize: number; // 每页数量
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
  status: boolean | number; // 状态
  wishResult: boolean | string; // 许愿结果
}

/**
 * @description 订单管理-创意许愿-实现心愿 /product-wish-order/achieve
 */
export interface IAchieveWishingOrderRes {
  [key: string]: any;
}

/**
 * @description PK 手管理-查询 PK 手列表 /player-pk/list
 */
export interface IGetPKPlayerListReq {
  name?: string; // PK手名称
  phone?: string; //	手机号码
  page: number; // 页码
  pageSize: number; // 每页数量
}
export interface IGetPKPlayerListRes {
  totalNum: number;
  list: IPKPlayerList[];
}
export interface IPKPlayerList {
  id: number; // pk手ID
  name: string; // pk手名称
  phone: string; // 手机号码
  winRate: number; // 胜率(百分号前面数字)
  integral: number; // 积分
}

/**
 * @description PK 手管理-查询店铺的 PK 选手信息列表 /player-pk/list-by-shop
 */
export interface IGetToDoSelectPlayerListReq {
  name?: string; // PK手名称
  phone?: string; //	手机号码
  page: number; // 页码
  pageSize: number; // 每页数量
}
export interface IGetToDoSelectPlayerListRes {
  totalNum: number;
  list: IToDoSelectPlayerList[];
}
export interface IToDoSelectPlayerList {
  id: number; // pk手ID
  name: string; // pk手名称
  phone: string; // 手机号码
  winRate: number; // 胜率(百分号前面数字)
  integral: number; // 积分
}
