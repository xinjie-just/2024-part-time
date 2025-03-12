/*
 * “配置管理”模块
 */
import {
  IGetConfigInfoReq,
  IGetConfigInfoRes,
  IGetConfigListReq,
  IGetConfigListRes,
  ISaveConfigInfoReq
} from './models';
import request from '@/services/axios';

const enum API {
  getConfigList = '/admin/list', // 获取员工列表
  getConfigInfo = '/admin/info', // 查询员工详细信息（包括权限）
  saveConfigInfo = '/admin/save', // 保存员工信息
  deleteConfig = '/admin/remove' // 删除员工
}

export const getConfigList = (data: IGetConfigListReq) => {
  return request<IGetConfigListRes>({
    url: API.getConfigList,
    method: 'get',
    data
  });
};

export const getConfigInfo = (data: IGetConfigInfoReq) => {
  return request<IGetConfigInfoRes>({
    url: API.getConfigInfo,
    method: 'get',
    data
  });
};

export const saveConfigInfo = (data: ISaveConfigInfoReq) => {
  return request<null>({
    url: API.saveConfigInfo,
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
