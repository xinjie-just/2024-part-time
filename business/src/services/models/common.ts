/**
 * @description 发送短信验证码 /common-server/send-phone-code
 */
export interface ISendPhoneCodeReq {
  phone: string;
}
export interface ISendPhoneCodeRes {
  codeKey: string;
  codeNum: number;
  validTime: number;
}

/**
 * @description 上传文件 /common-server/upload-file
 */
export interface IUploadFileReq {
  file: File;
}
