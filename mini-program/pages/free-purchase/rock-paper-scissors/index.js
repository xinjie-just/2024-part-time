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
    time: 60 * 1000,
    matchDuration: duration, // 游戏匹配时长，单位毫秒
    gameStartCountdown: 0,
    timeData: {},
    matched: "waiting", // 匹配对手状态；waiting 未开始、匹配中，success 匹配成功，fail 匹配失败
    ownRadio: null, // 1:石头；2:剪刀；3:布
    otherRadio: null, // 1:石头；2:剪刀；3:布
    showExplain: false,
    result: null, // 0 平局，1 我胜，2 对方胜，null 等待出拳
    gameInfo: {
      userInfo: {},
      rivalInfo: {},
      gameDuration: 0
    }
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
    commonService.rpsReady()
      .then((result) => {
        console.log("游戏准备---result", result);
        this.gameMatch();
      })
      .catch(() => {
        Toast.clear();
      })
      .finally(() => {
      })
  },
  // 游戏匹配
  gameMatch() {
    commonService.rpsMatch()
      .then((result) => {
        console.log("游戏匹配---result", result);
        if (result) {
          // 匹配成功，返回游戏信息
          this.setData({
            matched: 'success',
          });
          Toast({
            type: 'success',
            message: '匹配完成，获取对局信息',
            onClose: () => {
              this.getRpsGameInfo();
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
            this.setData({
              matchDuration: this.data.matchDuration - matchRotationInterval
            }, setTimeout(() => {
              this.gameMatch();
            }, matchRotationInterval) // 发起轮训
            )
          }
        }
      })
      .catch(() => {
        Toast.clear();
      })
      .finally(() => {
      })
  },

  onTryAgain() {
    this.setData({
      matched: "waiting",
      matchDuration: duration
    }, this.gameReady());
  },

  // 获取对局信息
  getRpsGameInfo() {
    commonService.rpsGameInfo()
      .then((result) => {
        console.log("获取对局信息---result", result);
        const userInfo = result.userInfo || {};
        const rivalInfo = result.rivalInfo || {};
        const gameDuration = result.gameDuration || 0;
        this.setData({
          gameInfo: {
            userInfo,
            rivalInfo,
            gameDuration
          },
          time: gameDuration * 1000
        });
        Toast.clear();
      })
      .finally(() => {
      })
  },

  /**
   * 组件的方法列表
   */
  onChangeTime(e) {
    this.setData({
      timeData: e.detail,
    });
  },
  finished() {
    Toast('出拳倒计时结束');
  },
  onExit() {
    Dialog.confirm({
      title: '',
      message: '您确认要退出吗？',
    })
      .then(() => {
        wx.redirectTo({
          url: '/pages/free-purchase/p-k-field/index',
        });
      })
      .catch(() => {
        // on cancel
      });
  },
  getWatchReault() {
    Toast({
      type: 'text',
      message: '对方已出拳',
      onClose: () => {
        const countDown = this.selectComponent('.count-time');
        countDown.pause();
        this.setData({
          result: 2,
          ownRadio: 1,
          otherRadio: 3,
        });
      },
    });
  },
  onContinue() {
    Dialog.confirm({
      title: '',
      message: '您确认要继续游戏吗？',
    })
      .then(() => {
        this.setData({
          ownRadio: null,
          otherRadio: null,
        });
        const countDown = this.selectComponent('.count-time');
        countDown.reset();
      })
      .catch(() => {
        // on cancel
      });
  },
  onViewExplain() {
    this.setData({ showExplain: true });
  },
  onCloseExplain() {
    this.setData({ showExplain: false });
  },
  onChangeOwn(e) {
    this.setData({
      ownRadio: e.detail,
    });
  },

  // 点击“我选好了”，就提交游戏结果
  onSelectFinish() {
    const params = {
      punch: this.data.ownRadio
    };
    commonService.rpsSubmit(params)
      .then(() => {
        Toast({
          type: 'text',
          message: '提交成功',
          onClose: () => {
            this.getRpsResult();
          },
        });
      })
      .finally(() => {
      })
  },
  // 查询石头剪刀布游戏结果
  getRpsResult() {
    commonService.rpsResult()
      .then((result) => {
        // 对局结果(0:平;1:赢;2:输)
        this.setData({
          result
        })
      })
      .finally(() => {
      })
  }
});