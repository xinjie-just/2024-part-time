/**
 * @description 查询用户账户信息 /account/info
 */
export interface IGetAccountInfoRes {
  id: 1; // 账户ID
  type: 1; // 账户类型(1:用户账户; 2:店铺账户)
  balance: 100; // 余额(单位:分)
}

/**
 * @description 查询账户交易信息列表 /account/transaction-list
 */
export interface IGetAccountExchangeListReq {
  source?: number; // 来源(1:订单; 2:扣款; 3:返点;)
  completeStartTime?: string; // 交易开始时间
  completeEndTime?: string; // 交易截止时间
  page: number; // 页码
  pageSize: number; // 每页数量
}
export interface IGetAccountExchangeListRes {
  totalNum: number;
  list: IAccountExchangeList[];
}
export interface IAccountExchangeList {
  id: number; // 自增ID
  balance: number; // 金额(单位:分)
  completeTime: string; // 完成时间
  source: number; // 来源(1:订单; 2:扣款; 3:返点;)
}

/**
 * @description 查询账户下银行卡列表 /account/back-card/list
 */
export interface IBankCardListRes {
  id: number; // 银行卡ID
  backName: string; // 银行卡开户银行
  cardUserName: string; // 银行卡户主名
  cardNumber: string; // 银行卡号
}

/**
 * @description 新增银行卡 /account/back-card/add
 */
export interface IAddBankCardReq {
  backName: string; // 银行卡开户银行
  cardUserName: string; // 银行卡户主名
  cardNumber: string; // 银行卡号
}

/**
 * @description 账户余额提现 /account/withdraw-deposit
 */
export interface IAccountWithdrawReq {
  backCardId: number; // 银行卡ID
  amount: number; // 提现金额(单位分)
}
