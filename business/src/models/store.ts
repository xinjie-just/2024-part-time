export interface IStore {
  index?: number
  storeName: string
  phone: string
  registrationTime: string
  status: string
  action?: () => void
}

export interface IAddShop {
  storeName: string
  phone: string
  password: string
}

export interface IUpdatePassword {
  password: string
  checkPassword: string
  imageCode: string
  phoneCode: string
}
