/*
 * “公共”模块
 */
import { ISendPhoneCodeReq, ISendPhoneCodeRes, IUploadFileReq } from './models';
import request from '@/services/axios';

const enum API {
  sendPhoneCode = '/common-server/send-phone-code', // 发送短信验证码
  uploadFile = '/common-server/upload-file' // 上传文件
}

export const sendPhoneCode = (data: ISendPhoneCodeReq) => {
  return request<ISendPhoneCodeRes>({
    url: API.sendPhoneCode,
    method: 'put',
    data
  });
};

export const uploadFile = (data: IUploadFileReq) => {
  return request<{}>({
    url: API.uploadFile,
    method: 'post',
    data
  });
};
