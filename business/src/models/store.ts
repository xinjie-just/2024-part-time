export interface IStore {
  index?: number;
  storeName: string;
  phone: string;
  registrationTime: string;
  property: number;
  status: number;
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

export interface IEditMyShop {
  name: string;
  address: string;
  location: string;
  contact: string;
  contactPhone: string;
  introduce: string;
}
