export interface IStaff {
  index?: number;
  id: number;
  name: string;
  phone: string;
  isOperate: boolean;
  registrationTime: string;
}

export interface IManageStaff {
  name: string;
  phone: string;
  password: string;
}

export interface IStaffPermission {
  label: string;
  value: string;
  children?: IStaffPermission[];
}
