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
  nickName: string;
  phone: string;
  password: string;
  permission: string[];
}

export interface IStaffPermission {
  label: string;
  value: string;
  children?: IStaffPermission[];
}
