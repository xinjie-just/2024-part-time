/*
 * “配置管理”模块
 */
import { IGetConfigListReq, ISaveConfigReq, IGetConfigListRes } from './models';
import request from '@/services/axios';

const enum API {
  getConfigList = '/dict/list', // 获取配置列表
  saveConfig = '/dict/save', // 新增修改配置
  deleteConfig = '/dict/remove' // 删除配置
}

export const getConfigList = (data: IGetConfigListReq) => {
  return request<IGetConfigListRes>({
    url: API.getConfigList,
    method: 'get',
    data
  });
};

export const saveConfig = (data: ISaveConfigReq) => {
  return request<null>({
    url: API.saveConfig,
    method: 'post',
    data
  });
};

export const deleteConfig = (data: { id: number }) => {
  return request<null>({
    url: API.deleteConfig,
    method: 'delete',
    data
  });
};
