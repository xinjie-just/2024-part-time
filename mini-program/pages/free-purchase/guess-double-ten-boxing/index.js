import Toast from '/@vant/weapp/toast/toast';
import Dialog from '/@vant/weapp/dialog/dialog';
import { freePruchaseService } from '../../../services/free-pruchase.js';
import { commonService } from '../../../services/common.js';
import { getPKOrderStage } from '../../../utils/common.js';

const matchRotationInterval = 6 * 1000; // 游戏匹配轮训时间间隔，单位毫秒，建议设置 5s 以上
const resultRotationInterval = 2 * 1000; // 获取结果轮训时间间隔，单位毫秒，建议设置 5s 以上
const duration = 300 * 1000; // 游戏匹配时长，单位毫秒，建议设置 30s 以上

Page({
  /**
   * 组件的初始数据
   */
  data: {
    icon: {
      rock: {
        default: '/assets/images/free-purchase/rock.png',
        own: '/assets/images/free-purchase/rock-own.png',
        other: '/assets/images/free-purchase/rock-other.png',
      },
      scissor: {
        default: '/assets/images/free-purchase/scissor.png',
        own: '/assets/images/free-purchase/scissor-own.png',
        other: '/assets/images/free-purchase/scissor-other.png',
      },
      paper: {
        default: '/assets/images/free-purchase/paper.png',
        own: '/assets/images/free-purchase/paper-own.png',
        other: '/assets/images/free-purchase/paper-other.png',
      },
    },

    matchDuration: duration, // 游戏匹配时长，单位毫秒
    startCountdown: 60 * 1000, // 游戏开始倒计时，单位毫秒
    startCountdownData: {},
    endCountdown: 60 * 1000, // 出拳倒计时，单位毫秒
    endCountdownData: {},
    matched: 'waiting', // 匹配对手状态；waiting 未开始、匹配中，success 匹配成功，fail 匹配失败，error 长时间未出拳
    ownRadio: null,
    otherRadio: null,
    ownCallPunch: 0,
    otherCallPunch: 0,
    selected: false,
    showExplain: false,
    result: null, // 0 平局，1 我胜，2 对方胜，null 等待出拳
    gameInfo: {
      userInfo: {},
      rivalInfo: {},
      gameDuration: 0,
    },
    getResultTimerId: null,
    gameMatchTimerId: null,
    orderId: null,
    orderGameId: null,
    remainingPKNumber: 0,
  },

  onLoad(options) {
    if (options.gameInfo !== undefined && options.gameInfo !== null) {
      const gameInfo = JSON.parse(options.gameInfo);

      this.setOptionsData(gameInfo);
    } else if (options.orderId !== undefined && options.orderId !== null) {
      this.setData(
        {
          orderId: +options.orderId,
        },
        () => {
          this.createPKDTBFn();
        },
      );
    }
  },
  async setOptionsData(gameInfo) {
    const systemTime = await commonService.getSystemTime();
    const gameStartTime = gameInfo.startTimeMillis;
    const startCountdown = gameStartTime - systemTime;
    this.setData(
      {
        orderGameId: +gameInfo.gameId,
        matched: 'success',
        startCountdown: startCountdown < 0 ? 0 : startCountdown,
      },
      () => {
        Toast({
          type: 'success',
          message: '游戏匹配完成，获取对局信息',
          forbidClick: true,
          onClose: () => {
            this.startPKDTBFn();
          },
        });
      },
    );
  },
  // 创建游戏
  createPKDTBFn() {
    Toast({
      type: 'loading',
      message: '正在匹配对手',
      duration: 0, // 不会消失（不会主动消失）
      forbidClick: true,
    });
    const params = {
      orderId: this.data.orderId,
    };
    freePruchaseService
      .createPKDTB(params)
      .then((res) => {
        const { orderGameId } = res;
        this.setData(
          {
            orderGameId,
          },
          () => {
            this.getPKDTBInfoFn();
          },
        );
      })
      .catch(() => {
        Toast({
          type: 'fail',
          message: err.message || '游戏创建失败',
          forbidClick: true,
        });
        this.setData({
          matched: 'fail',
        });
      });
  },
  // 石头剪刀布，游戏匹配
  getPKDTBInfoFn() {
    const params = { orderGameId: this.data.orderGameId };
    freePruchaseService
      .getPKDTBInfo(params)
      .then(async (result) => {
        if (result?.startTimeMillis && result?.gameId) {
          // 匹配成功，获取到游戏信息
          const systemTime = await commonService.getSystemTime();
          const gameStartTime = result.startTimeMillis;
          const startCountdown = gameStartTime - systemTime;
          this.setData({
            matched: 'success',
            gameId: result.gameId,
            startCountdown: startCountdown < 0 ? 0 : startCountdown,
          });
          Toast({
            type: 'success',
            message: '匹配完成，获取对局信息',
            forbidClick: true,
            onClose: () => {
              this.startPKDTBFn();
            },
          });
        } else {
          // 未匹配成功
          if (this.data.matchDuration <= 0) {
            this.setData({
              matched: 'fail',
            });
            Toast({
              type: 'fail',
              message: '未匹配到对手',
              forbidClick: true,
            });
          } else {
            const gameMatchTimerId = setTimeout(() => {
              this.getPKDTBInfoFn();
            }, matchRotationInterval); // 发起轮训，再次游戏匹配
            this.setData({
              matchDuration: this.data.matchDuration - matchRotationInterval,
              gameMatchTimerId,
            });
          }
        }
      })
      .catch((err) => {
        Toast({
          type: 'fail',
          message: err.message || '游戏匹配失败',
          forbidClick: true,
        });
        this.setData({
          matched: 'fail',
        });
      });
  },

  onTryAgain() {
    this.setData(
      {
        ownRadio: null,
        otherRadio: null,
        matched: 'waiting',
        matchDuration: duration,
        result: null,
        selected: false,
      },
      this.createPKDTBFn(),
    );
  },

  // 获取对局信息
  getPKDTBArenaInfoFn() {
    const params = { gameId: this.data.gameId };
    freePruchaseService
      .getPKDTBArenaInfo(params)
      .then((result) => {
        if (result?.rivalInfo) {
          const userInfo = result.userInfo || {};
          const { rivalInfo } = result;
          rivalInfo.phone = rivalInfo.phone.replace(/(\d{3})\d{0,}(\d{4})/, '$1****$2');
          userInfo.phone = userInfo.phone.replace(/(\d{3})\d{0,}(\d{4})/, '$1****$2');
          const gameDuration = result.gameDuration || 0;
          this.setData({
            gameInfo: {
              userInfo,
              rivalInfo,
              gameDuration,
            },
            endCountdown: gameDuration * 1000,
          });
        } else {
          Toast({
            type: 'fail',
            message: '获取对局信息失败',
            forbidClick: true,
          });
          this.setData({
            matched: 'fail',
          });
        }
      })
      .catch((err) => {
        Toast({
          type: 'fail',
          message: err.message || '获取对局信息失败',
          forbidClick: true,
        });
        this.setData({
          matched: 'fail',
        });
      });
  },

  startPKDTBFn() {
    const params = { gameId: this.data.gameId };
    freePruchaseService.startPKDTB(params).then(() => {
      Toast({
        type: 'success',
        message: '游戏已开始，正在获取对手信息',
        forbidClick: true,
        onClose: () => {
          this.getPKDTBArenaInfoFn();
        },
      });
    });
  },
  // 游戏开始倒计时时间改变
  onChangeStartTime(e) {
    this.setData({
      startCountdownData: e.detail,
    });
  },

  // 游戏出拳倒计时时间改变
  onChangeEndTime(e) {
    this.setData({
      endCountdownData: e.detail,
    });
  },

  endFinished() {
    if (!this.data.selected) {
      Toast('时间到，出拳结束');
    } else {
      const countDown = this.selectComponent('.end-countdown');
      countDown.pause(); 
    }
  },
  startFinished() {
    // freePruchaseService.createPKDTB();
  },

  // 选择/改变我的选择
  onChangeOwn(e) {
    this.setData({
      ownRadio: +e.detail,
    });
  },

  // 点击“我选好了”，就提交游戏结果
  onSelectFinish() {
    this.setData({
      selected: true,
    });
    const params = {
      punch: +this.data.ownRadio,
      callPunch: this.data.ownCallPunch,
      gameId: this.data.gameId,
    };
    freePruchaseService
      .submitPKDTB(params)
      .then(() => {
        Toast({
          type: 'loading',
          message: '提交成功，正在查询结果，请耐心等待',
          forbidClick: true,
          duration: 0,
        });
        setTimeout(() => {
          this.getPKDTBResultFn();
        }, 2000);
      })
      .catch((err) => {
        Toast({
          type: 'fail',
          message: err.message || '提交失败',
          forbidClick: true,
        });
      });
  },
  // 石头剪刀布，查询游戏结果
  getPKDTBResultFn() {
    const params = {
      gameId: this.data.gameId,
    };
    freePruchaseService
      .getPKDTBResult(params)
      .then(async (result) => {
        if (result?.rivalCommitDetail) {
          // 查询到结果，对局结果(0:平;1:赢;2:输)
          this.setData({
            result: result.winner,
            otherRadio: `${result.rivalCommitDetail.punch}`, // 换换成 string
            otherCallPunch: result.rivalCommitDetail.callPunch,
          });
          Toast({
            type: 'success',
            message: '已查询到结果，比赛结束',
            forbidClick: true,
          });
          
          const res = await getPKOrderStage(this.data.orderId);
          if (res.stage === 3) {
            const pkNum = res.pkNum;
            this.setData({
              remainingPKNumber: +pkNum,
            });
          }
        } else {
          // 未查询到结果
          if (this.data.matchDuration <= 0) {
            this.setData({
              matched: 'error',
            });
            Toast({
              type: 'fail',
              message: '对手长时间未出拳，游戏结束',
              forbidClick: true,
            });
          } else {
            const getResultTimerId = setTimeout(() => {
              this.getPKDTBResultFn();
            }, resultRotationInterval); // 发起轮训，再次查询游戏结果
            this.setData({
              matchDuration: this.data.matchDuration - resultRotationInterval,
              getResultTimerId,
            });
          }
        }
      })
      .catch((err) => {
        Toast({
          type: 'fail',
          message: err.message || '提交失败',
          forbidClick: true,
        });
      });
  },

  // 退出确认
  onExit() {
    Dialog.confirm({
      title: '',
      message: '您确认要退出吗？',
    }).then(() => {
      wx.redirectTo({
        url: '/pages/common/p-k-field/index',
      });
    });
  },

  // 继续游戏确认
  onContinue() {
    Dialog.confirm({
      title: '',
      message: '您确认要继续游戏吗？',
    }).then(() => {
      const startCountDown = this.selectComponent('.start-countdown');
      startCountDown.reset();
      const endCountDown = this.selectComponent('.end-countdown');
      endCountDown.reset();

      this.setData(
        {
          ownRadio: null,
          otherRadio: null,
          matched: 'waiting',
          matchDuration: duration,
          result: null,
          selected: false,
        },
        this.gameReady(),
      );
    });
  },
  // 打开 'PK双方出拳结束语'
  onViewExplain() {
    this.setData({ showExplain: true });
  },
  // 关闭 'PK双方出拳结束语'
  onCloseExplain() {
    this.setData({ showExplain: false });
  },
  onChangeStepper(e) {
    this.setData({
      ownCallPunch: +e.detail,
    });
  },

  onHide() {
    clearTimeout(this.data.gameMatchTimerId);
    clearTimeout(this.data.getResultTimerId);
  },

  onUnload() {
    clearTimeout(this.data.gameMatchTimerId);
    clearTimeout(this.data.getResultTimerId);
  },
});
