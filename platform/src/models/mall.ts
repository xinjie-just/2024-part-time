export interface IPKForSale {
  id: number;
  goodsName: string;
  originalPrice: number;
  settlementPrice: number;
  currentPrice: number;
  QRCode: string;
}

export interface IPKSoldOut {
  id: number;
  orderId: string;
  goodsName: string;
  originalPrice: number;
  settlementPrice: number;
  currentPrice: number;
  sellTime: string;
}

export interface IPKOutOfSale {
  id: number;
  goodsName: string;
  originalPrice: number;
  settlementPrice: number;
  currentPrice: number;
}

export interface IManagePK {
  name: string;
  title: string;
  img: string;
  introduce: string;
  originalPrice: number;
  settlementPrice: number;
  currentPrice: number;
  minPrice: number;
  digit: number;
  times: number;
}

export interface IScanForSale {
  id: number;
  goodsName: string;
  originalPrice: number;
  settlementPrice: number;
  minPrice: number;
  QRCode: string;
}

export interface IScanOutOfSale {
  id: number;
  goodsName: string;
  originalPrice: number;
  settlementPrice: number;
  minPrice: number;
}

export interface IManageScan {
  name: string;
  title: string;
  img: string;
  introduce: string;
  originalPrice: number;
  settlementPrice: number;
  currentPrice: number;
  minPrice: number;
  digit: number;
}

export interface IMayWishing {
  id: number;
  wishingName: string;
  referenceValue: number;
  QRCode: string;
}

export interface IManageWishing {
  name: string;
  title: string;
  img: string;
  introduce: string;
  referenceValue: number;
  minPrice: number;
  digit: number;
}

export interface IPKHandle {
  id: number;
  name: string;
  phone: string;
  winningPercentage: number;
  points: number;
}

export interface IAddPKHandle {
  name: string;
  phone: string;
  winningPercentage: number;
  points: number;
}

export interface IPKOrder {
  id: number;
  orderId: string;
  PKName: string;
  phone: string;
  PKSum: number;
  goodsSum: number;
  sendFree: number | null; // 1 表示送，0 表示不送
  status: number | null; // 1 已发货，0 表示未发货
}

export interface IScanOrder {
  id: number;
  orderId: string;
  scanName: string;
  phone: string;
  goodsSum: number;
  sendFree: number | string; // 1 表示送，0 表示不送
}

export interface IWishingOrder {
  id: number;
  orderId: string;
  wishingName: string;
  phone: string;
  minPrice: number;
  maxPrice: number;
  status: number | string; // 1 成，0 否
  wishingResult: number | string; // 1 已实现，0 未实现
}
