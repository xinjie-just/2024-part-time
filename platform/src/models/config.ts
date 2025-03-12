export interface IConfig {
  index?: number;
  id: number;
  name: string;
  loginName: string;
  phone: string;
  registrationTime: string;
}

export interface IManageConfig {
  name: string;
  loginName: string;
  phone: string;
  password: string;
}

export interface IConfigPermission {
  label: string;
  value: string;
  children?: IConfigPermission[];
}
