/*
 * “员工管理”模块
 */
import {
  IGetStaffInfoReq,
  IGetStaffInfoRes,
  IGetStaffListReq,
  IGetStaffListRes,
  ISaveStaffInfoReq
} from './models';
import request from '@/services/axios';

const enum API {
  getStaffList = '/admin/list', // 获取员工列表
  getStaffInfo = '/admin/info', // 查询员工详细信息（包括权限）
  saveStaffInfo = '/admin/save' // 保存员工信息
}

export const getStaffList = (data: IGetStaffListReq) => {
  return request<IGetStaffListRes>({
    url: API.getStaffList,
    method: 'get',
    data
  });
};

export const getStaffInfo = (data: IGetStaffInfoReq) => {
  return request<IGetStaffInfoRes>({
    url: API.getStaffInfo,
    method: 'get',
    data
  });
};

export const saveStaffInfo = (data: ISaveStaffInfoReq) => {
  return request<null>({
    url: API.saveStaffInfo,
    method: 'post',
    data
  });
};
