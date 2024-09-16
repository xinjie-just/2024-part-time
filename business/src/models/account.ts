export interface IBalance {
  sum: string | number;
  time: string;
  source: number | string;
}

export interface IAddAccount {
  bank: string;
  name: string;
  account: string;
}
