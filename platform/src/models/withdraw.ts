export interface IGetWithdrawListRes {
  id: number; // ID
  shopPhone: string; // 商户手机号
  shopName: string; // 商户名称
  bankName: string; // 开户行
  cardNumber: string; // 账号
  cardUserName: string; // 账户姓名
  amount: number; // 提现金额 (单位：分)
  submitTime: string; // 申请时间
  status: number; // 状态 (0:未处理 1:已处理 2:已拒绝)
}
