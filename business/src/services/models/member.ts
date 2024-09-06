/**
 * @description 获取会员列表 /shop-member/list
 */
export interface IGetMemberListReq {
  name: string;
  phone: string;
}
export interface IGetMemberListRes {
  totalNum: number;
  list: IMemberList[];
}
export interface IMemberList {
  id: string;
  name: string;
  headIcon: string;
  phone: string;
  registerTime: string;
}

/**
 * @description 给指定会员发送消息 /shop-member/send-message
 */
export interface ISendMessageReq {
  memberIds: number[];
  message: string;
}
