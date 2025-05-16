export interface IStore {
  index?: number;
  storeName: string;
  userName?: string;
  phone: string;
  registrationTime: string;
  property: number;
  state: number;
  action?: () => void;
}

export interface IAddShop {
  storeName: string;
  phone: string;
  password: string;
}

export interface IUpdatePassword {
  password: string;
  checkPassword: string;
  imageCode: string;
  phoneCode: string;
}

export interface IResetPassword {
  password: string;
  checkPassword: string;
  imageCode: string;
  phoneCode: string;
  phone: string;
}

export interface IEditMyShop {
  name: string;
  address: string;
  contact: string;
  contactPhone: string;
  introduce: string;
}
