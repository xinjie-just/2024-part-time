import { freePruchaseService } from '../services/free-pruchase.js';

// 获取订单阶段 1:支付竞猜金额 2:玩竞猜游戏 3:玩PK游戏 4:支付剩余金额 5:已完成
const getPKOrderStage = async (orderId) => {
  return freePruchaseService
    .getPKOrderStage({ orderId })
    .then((res) => {
      const { stage, pkNum } = res;
      switch (stage) {
        case 1: {
          return freePruchaseService.createPKGuessPay({ orderId }).then((res) => {
            const data = {
              payOrderId: res.payOrderId,
              orderPrice: res.price,
              stage,
            };
            return Promise.resolve(data);
          });
        }
        case 2: {
          return Promise.resolve({ stage });
        }
        case 3: {
          return Promise.resolve({ stage, pkNum });
        }
        case 4: {
          return freePruchaseService.createPKRemainPayOrder({ orderId }).then((res) => {
            const data = {
              payOrderId: res.payOrderId,
              orderPrice: res.price,
              stage,
            };
            return Promise.resolve(data);
          });
        }
        case 5: {
          return Promise.resolve({ stage });
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
