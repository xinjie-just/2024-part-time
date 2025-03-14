/**
 * @description 获取配置列表 /dict/list
 */
export interface IGetConfigListRes {
  id: number; // ID
  type: string; // 数据分类
  name: string; // 数据名称
  value: string; // 数据值
  sort: number; // 数据排序
  remark: string; // 数据备注
}

/**
 * @description 新增修改配置 /dict/save
 */
export interface ISaveConfigReq {
  id?: number; // ID
  type: string; // 数据分类
  name: string; // 数据名称
  value: string; // 数据值
  sort: number; // 数据排序
  remark: string; // 数据备注
}
