/*
 * “公共”模块
 */
import { ISendPhoneCodeReq, ISendPhoneCodeRes, IGetDictReq, IGetDictRes } from './models';
import request from '@/services/axios';

const enum API {
  sendPhoneCode = '/common-server/send-phone-code', // 发送短信验证码
  uploadFile = '/common-server/upload-file', // 上传文件
  getDict = '/common-server/get-dict' // 获取一些公共信息
}

export const sendPhoneCode = (data: ISendPhoneCodeReq) => {
  return request<ISendPhoneCodeRes>({
    url: API.sendPhoneCode,
    method: 'put',
    data
  });
};

export const uploadFile = (data: any) => {
  return request<{}>({
    url: API.uploadFile,
    method: 'post',
    data
  });
};

export const getDict = (data: IGetDictReq) => {
  return request<IGetDictRes[]>({
    url: API.getDict,
    method: 'get',
    data
  });
};

export const uploadFilePath = `/manage${API.uploadFile}`;
export const defaultOrigin = 'https://www.00goo.com';
