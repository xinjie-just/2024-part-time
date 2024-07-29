/**
 * 加密解密
 */
import CryptoJS from 'crypto-js';

//秘钥
const aesKey = 'C{vD6QM+Se7ZW5vnWhp4g~&XxapPx-L@';

//将秘钥转换成 Utf8 字节数组
const key = CryptoJS.enc.Utf8.parse(aesKey);

// 加密
export const encryption = (pwd: string): string => {
  const encryptData = CryptoJS.enc.Utf8.parse(pwd);
  const encrypted = CryptoJS.AES.encrypt(encryptData, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
};

// 解密
export const decryption = (pwd: string): string => {
  const decrypt = CryptoJS.AES.decrypt(pwd, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
};
