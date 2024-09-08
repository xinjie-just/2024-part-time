/*
 * “账户管理”模块
 */
import {
  IGetAccountExchangeListReq,
  IGetAccountExchangeListRes,
  IGetAccountInfoRes,
  IBankCardListRes,
  IAddBankCardReq,
  IAccountWithdrawReq
} from './models';
import request from '@/services/axios';

const enum API {
  getAccountInfo = '/account/info', // 查询用户账户信息
  getAccountExchangeList = '/account/transaction-list', // 查询账户交易信息列表
  getBankCardList = '/account/back-card/list', // 查询账户下银行卡列表
  addBankCard = '/account/back-card/add', // 新增银行卡
  removeBankCard = '/account/back-card/remove', // 删除银行卡
  accountWithdraw = '/account/withdraw-deposit' // 余额提现
}

export const getAccountInfo = () => {
  return request<IGetAccountInfoRes>({
    url: API.getAccountInfo,
    method: 'get'
  });
};

export const getAccountExchangeList = (data: IGetAccountExchangeListReq) => {
  return request<IGetAccountExchangeListRes>({
    url: API.getAccountExchangeList,
    method: 'get',
    data
  });
};

export const getBankCardList = () => {
  return request<IBankCardListRes[]>({
    url: API.getBankCardList,
    method: 'get'
  });
};

export const addBankCard = (data: IAddBankCardReq) => {
  return request<null>({
    url: API.addBankCard,
    method: 'post',
    data
  });
};

export const removeBankCard = (data: { id: number }) => {
  return request<null>({
    url: API.removeBankCard,
    method: 'delete',
    data
  });
};

export const accountWithdraw = (data: IAccountWithdrawReq) => {
  return request<null>({
    url: API.accountWithdraw,
    method: 'post',
    data
  });
};
