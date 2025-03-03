export interface IShareData {
  title: string; // 分享标题
  desc: string; // 分享描述
  link: string; // 分享链接
  imgUrl: string; // 分享图标
  success?: () => void; // 分享成功回调
}

export interface IRouterType {
  path?: string;
  name?: string;
  label?: string;
  key?: string;
  icon?: any;
  title?: string;
  component?: any;
  redirect?: string;
  children?: IRouterType[];
}

export interface IPage {
  total?: number;
  current: number;
  pageSize: number;
}
