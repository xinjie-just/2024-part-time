/*
 * “会员”模块
 */
import { IGetMemberListReq, IGetMemberListRes, ISendMessageReq } from './models';
import request from '@/services/axios';

const enum API {
  getMemberList = '/shop-member/list', // 获取会员信息列表
  sendMessage = '/shop-member/send-message' // 给指定会员发送消息
}

export const getMemberList = (data: IGetMemberListReq) => {
  return request<IGetMemberListRes>({
    url: API.getMemberList,
    method: 'get',
    hideLoading: true,
    data
  });
};

export const sendMessage = (data: ISendMessageReq) => {
  return request<null>({
    url: API.sendMessage,
    method: 'post',
    hideLoading: true,
    data
  });
};
