/**
 * @description: HTTPCode
 */
export enum EHTTPCodeEnum {
  '访问未授权' = '401',
  '访问被拒绝' = '403',
  '请求地址有误' = '404',
  '访问被拒绝(405)' = '405',
  '服务器发生错误,请稍后再试' = '500',
  '网关错误' = '502',
  '服务不可用' = '503',
  '网关超时' = '504',
  '不支持所请求http协议版本' = '505',
  '请求失败,请检查您的网络设置' = '-1',
}

/**
 * @description: 请求结果集
 */
export enum EResultEnum {
  '成功' = '00000',
  '参数错误' = '001',
  '授权错误' = '002',
  '未找到资源' = '004',
  '内部错误' = '005',
  '行为错误' = '006',
  '业务错误' = '010',
  '通用异常' = '999',
}

/**
 * @description: 请求方法
 */
export enum ERequestEnum {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * @description:  常用的 contentTyp 类型
 */
export enum EContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // json
  TEXT = 'text/:plain="true";charset=UTF-8',
  // form-data 一般配合qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  上传
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}
