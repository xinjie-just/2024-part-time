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
