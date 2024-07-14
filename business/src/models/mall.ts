export interface IPKForSale {
  id: number
  goodsName: string
  originalPrice: number
  settlementPrice: number
  currentPrice: number
  QRCode: string
}

export interface IPKSoldOut {
  id: number
  orderId: string
  goodsName: string
  originalPrice: number
  settlementPrice: number
  currentPrice: number
  sellTime: string
}

export interface IPKOutOfSale {
  id: number
  goodsName: string
  originalPrice: number
  settlementPrice: number
  currentPrice: number
}

export interface IManagePK {
  name: string
  title: string
  introduce: string
  originalPrice: number
  settlementPrice: number
  currentPrice: number
  miniPrice: number
  digit: number
  time: number
}

export interface IScanForSale {
  id: number
  goodsName: string
  originalPrice: number
  settlementPrice: number
  currentPrice: number
  QRCode: string
}

export interface IScanOutOfSale {
  id: number
  goodsName: string
  originalPrice: number
  settlementPrice: number
  currentPrice: number
}

export interface IManageScan {
  name: string
  title: string
  introduce: string
  originalPrice: number
  settlementPrice: number
  currentPrice: number
  miniPrice: number
  digit: number
}
