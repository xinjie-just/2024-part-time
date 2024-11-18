/**
 * 加密解密
 */
import CryptoJS from 'crypto-js';

//秘钥
const aesKey = 'Bg632RBAMFT8705k';
const aesIv = '5pWTRR2vsk2WIC00';

//将秘钥转换成 Utf8 字节数组
const key = CryptoJS.enc.Utf8.parse(aesKey);
const iv = CryptoJS.enc.Utf8.parse(aesIv);

// 加密
export const encryption = (pwd) => {
  const encryptData = CryptoJS.enc.Utf8.parse(pwd);
  const encrypted = CryptoJS.AES.encrypt(encryptData, key, {
    iv,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
};

// 解密
export const decryption = (pwd) => {
  const decrypt = CryptoJS.AES.decrypt(pwd, key, {
    iv,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.Pkcs7
  });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
};
