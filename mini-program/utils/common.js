import { freePruchaseService } from '../services/free-pruchase.js';

// 获取订单阶段
const getPKOrderStage = (orderId) => {
  freePruchaseService
    .getPKOrderStage({ orderId })
    .then((res) => {
      const { state } = res;
      switch (state) {
        case 1: {
          freePruchaseService.createPKGuessPay({ orderId }).then((res) => {
            const data = {
              payOrderId: res.payOrderId,
              orderPrice: res.price,
              state,
            };
            return Promise.resolve(data);
          });
        }
        case 2: {
          return Promise.resolve({ state });
        }
        case 3: {
          return Promise.resolve({ state });
        }
        case 4: {
          freePruchaseService.createPKRemainPayOrder({ orderId }).then((res) => {
            const data = {
              payOrderId: res.payOrderId,
              orderPrice: res.price,
              state,
            };
            return Promise.resolve(data);
          });
          break;
        }
        case 5: {
          return Promise.resolve(data);
        }
      }
    })
    .catch((err) => {
      wx.showToast({
        title: '获取订单阶段失败',
        icon: 'none',
        duration: 3000,
      });
      return Promise.reject(err);
    });
};

export { getPKOrderStage };
