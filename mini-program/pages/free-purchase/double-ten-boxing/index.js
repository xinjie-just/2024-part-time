import Toast from '/@vant/weapp/toast/toast';
import Dialog from '/@vant/weapp/dialog/dialog';
import { commonService } from '../../../services/common.js';

const matchRotationInterval = 6 * 1000; // 游戏匹配轮训时间间隔，单位毫秒，建议设置 5s 以上
const duration = 30 * 1000; // 游戏匹配时长，单位毫秒，建议设置 30s 以上

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
    gameKey: '',
    getResultTimerId: null,
    gameMatchTimerId: null,
  },

  onLoad() {
    this.gameReady();
  },
  // 游戏准备
  gameReady() {
    Toast({
      type: 'loading',
      message: '正在匹配对手',
      duration: 0, // 不会消失（不会主动消失）
    });
    commonService
      .dtbReady()
      .then(() => {
        this.gameMatch();
      })
      .catch(() => {
        Toast({
          type: 'fail',
          message: err.message || '游戏准备失败',
        });
        this.setData({
          matched: 'fail',
        });
      });
  },
  // 石头剪刀布，游戏匹配
  gameMatch() {
    commonService
      .dtbMatch()
      .then(async (result) => {
        if (result?.startTimeMillis && result?.gameKey) {
          // 匹配成功，获取到游戏信息
          const systemTime = await commonService.getSystemTime();
          const gameStartTime = result.startTimeMillis;
          const startCountdown = gameStartTime - systemTime;
          this.setData({
            matched: 'success',
            gameKey: result.gameKey,
            startCountdown: startCountdown < 0 ? 0 : startCountdown,
          });
          Toast({
            type: 'success',
            message: '匹配完成，获取对局信息',
            onClose: () => {
              this.getDtbGameInfo();
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
            });
          } else {
            const gameMatchTimerId = setTimeout(() => {
              this.gameMatch();
            }, matchRotationInterval) // 发起轮训，再次游戏匹配
            this.setData({
              matchDuration: this.data.matchDuration - matchRotationInterval,
              gameMatchTimerId
            });
          }
        }
      })
      .catch((err) => {
        Toast({
          type: 'fail',
          message: err.message || '游戏匹配失败',
        });
        this.setData({
          matched: 'fail',
        });
      });
  },

  onTryAgain() {
    this.setData(
      {
        matched: 'waiting',
        matchDuration: duration,
      },
      this.gameReady(),
    );
  },

  // 获取对局信息
  getDtbGameInfo() {
    commonService
      .dtbGameInfo()
      .then((result) => {
        if (result?.rivalInfo) {
          const userInfo = result.userInfo || {};
          const rivalInfo = result.rivalInfo;
          const gameDuration = result.gameDuration || 0;
          this.setData({
            gameInfo: {
              userInfo,
              rivalInfo,
              gameDuration,
            },
            endCountdown: gameDuration * 1000,
          });
          if (this.data.startCountdown <= 0) {
            commonService.dtbStart();
            Toast('游戏已开始，请选择出拳');
          }
        } else {
          Toast({
            type: 'fail',
            message: '获取对局信息失败',
          });
        }
      })
      .catch((err) => {
        Toast({
          type: 'fail',
          message: err.message || '获取对局信息失败',
        });
        this.setData({
          matched: 'fail',
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
    Toast('时间到，出拳结束');
  },
  startFinished() {
    commonService.dtbStart();
  },

  // 选择/改变我的选择
  onChangeOwn(e) {
    this.setData({
      ownRadio: e.detail,
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
    };
    commonService
      .dtbSubmit(params)
      .then(() => {
        Toast({
          type: 'loading',
          message: '提交成功，正在查询结果',
          duration: 0,
        });
        setTimeout(() => {
          this.getDtbResult();
        }, 2000);
      })
      .catch((err) => {
        Toast({
          type: 'fail',
          message: err.message || '提交失败',
        });
      });
  },
  // 石头剪刀布，查询游戏结果
  getDtbResult() {
    const params = {
      gameKey: this.data.gameKey,
    };
    commonService
      .dtbResult(params)
      .then((result) => {
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
          });
        } else {
          // 未匹配成功
          if (this.data.matchDuration <= 0) {
            this.setData({
              matched: 'error',
            });
            Toast({
              type: 'fail',
              message: '对手长时间未出拳，游戏结束',
            });
          } else {
            const getResultTimerId = setTimeout(() => {
              this.getDtbResult();
            }, matchRotationInterval); // 发起轮训，再次查询游戏结果
            this.setData({
              matchDuration: this.data.matchDuration - matchRotationInterval,
              getResultTimerId
            });
          }
        }
      })
      .catch((err) => {
        Toast({
          type: 'fail',
          message: err.message || '提交失败',
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
        url: '/pages/free-purchase/p-k-field/index',
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
        },
        this.gameReady(),
      );
    });
  },
  // 打开 'PK双方出拳解释束语'
  onViewExplain() {
    this.setData({ showExplain: true });
  },
  // 关闭 'PK双方出拳解释束语'
  onCloseExplain() {
    this.setData({ showExplain: false });
  },
  onChangeStepper(e) {
    console.log('onChangeStepper', e.detail);
    this.setData({
      ownCallPunch: e.detail,
    });
  },

  onHide() {
    clearTimeout(this.data.gameMatchTimerId);
    clearTimeout(this.data.getResultTimerId);
  },

  onUnload() {
    clearTimeout(this.data.gameMatchTimerId);
    clearTimeout(this.data.getResultTimerId);
  }
});
