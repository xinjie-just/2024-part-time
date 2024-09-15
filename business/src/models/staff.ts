export interface IStaff {
  index?: number;
  id: number;
  name: string;
  nickName: string;
  phone: string;
  registrationTime: string;
}

export interface IManageStaff {
  name: string;
  loginName: string;
  phone: string;
  password: string;
}

export interface IStaffPermission {
  label: string;
  value: string;
  children?: IStaffPermission[];
}
