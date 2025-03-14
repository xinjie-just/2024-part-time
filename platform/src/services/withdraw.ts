/*
 * “提现管理”模块
 */
import { IAuditWithdrawReq, IGetWithdrawListRes } from './models';
import request from '@/services/axios';

const enum API {
  getWithdrawList = '/withdraw-deposit/list', // 提现申请列表
  auditWithdraw = '/withdraw-deposit/audit', // 处理申请记录
  downloadWithdraw = '/withdraw-deposit/download' // 下载提现申请记录
}

export const getWithdrawList = () => {
  return request<IGetWithdrawListRes>({
    url: API.getWithdrawList,
    method: 'get'
  });
};

export const auditWithdraw = (data: IAuditWithdrawReq) => {
  return request<null>({
    url: API.auditWithdraw,
    method: 'put',
    data
  });
};

export const downloadWithdraw = () => {
  return request<null>({
    url: API.downloadWithdraw,
    method: 'post'
  });
};
