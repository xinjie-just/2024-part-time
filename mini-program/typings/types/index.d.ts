/// <reference path="./wx/index.d.ts" />

interface IEvent {
  currentTarget: {
    id: string;
    dataset: {
      [key: string]: any;
    }
  };
  detail: { value: string };
  target: {
    id: string; dataset: {
      [key: string]: any;
    }
  };
  timeStamp: number;
  type: string;
}