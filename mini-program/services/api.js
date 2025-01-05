// 接口地址
const API = {
  address: {
    getSystemTime: '/common-server/system-time', // 获取系统时间
    wxLogin: '/login-wechat', // 微信登录
    passwordLogin: '/login-pw', // 账号密码登录
    getUserInfo: '/user-info', // 获取用户信息

    pointTotal: '/integral/info', // 获取用户积分信息
    pointDetailList: '/integral/detail-list', // 获取用户积分明细列表
    walletInfo: '/wallet/info', // 获取用户钱包信息
    walletDetailList: '/wallet/detail-list', // 获取用户钱包明细列表

    getPKTask: '/product-pk/pk-task', // 获取当前用户是否有可以参加的任务
    getPKList: '/product-pk/list', // 获取PK商品信息列表
    getPKDetail: '/product-pk/detail', // 获取PK商品详细信息
    createPKTask: '/product-pk/create-pk-task', // 创建PK任务，在支付完成后需要进行创建PK对局的时候
    createPKOrder: '/product-pk/create-order', // 创建订单
    getPKOrderInfo: '/product-pk/order-info', // 获取 PK 订单信息
    getPKOrderStage: '/product-pk/order-stage', // 获取订单阶段
    createPKGuessPay: '/product-pk/create-guess-pay', // 支付竞猜金额（创建竞猜支付订单）
    updatePKOrderPayStatus: '/product-pk/update-guess-pay', // 更新竞猜支付状态
    getPKGuessInfo: '/product-pk/guess-info', // 获取竞猜信息
    submitPKGuess: '/product-pk/guess-submit', // 提交竞猜
    createPKRemainPayOrder: '/product-pk/create-remain-pay', // 创建剩余金额支付订单
    updatePKOrderRemainPayStatus: '/product-pk/update-remain-pay', // 更新剩余金额支付状态

    joinGame: '/product-pk/join-game', // PK手-加入游戏
    createPKRPS: '/product-pk/create-rps', // 石头剪刀布-创建游戏
    matchPKRPS: '/product-pk/match-rps', // 石头剪刀布-获取游戏信息
    getPKRPSArenaInfo: '/product-pk/arena-detail-rps', // 石头剪刀布-获取对手信息
    startPKRPS: '/product-pk/start-rps', // 石头剪刀布-开始游戏
    submitPKRPS: '/product-pk/submit-rps', // 石头剪刀布-提交游戏
    getPKRPSResult: '/product-pk/result-rps', // 石头剪刀布-获取游戏结果
    createPKDTB: '/product-pk/create-dtb', // 双十拳-创建游戏
    matchPKDTBInfo: '/product-pk/match-dtb', // 双十拳-获取游戏信息
    getPKDTBArenaInfo: '/product-pk/arena-detail-dtb', // 双十拳-获取对手信息
    startPKDTB: '/product-pk/start-dtb', // 双十拳-开始游戏
    submitPKDTB: '/product-pk/submit-dtb', // 双十拳-提交游戏
    getPKDTBResult: '/product-pk/result-dtb', // 双十拳-获取游戏结果

    getWishingRecord: '/product-wish/record-list', // 查询用户的历史心愿
    getWishingSuggestList: '/product-wish/suggest-list', // 获取推荐的心愿列表
    createWishing: '/product-wish/create-wish', // 创建心愿
    createWishingOrder: '/product-wish/create-order', // 创建心愿订单
    updateWishingOrderPayStatus: '/product-wish/update-order-pay', // 刷新心愿订单支付状态
    submitWishingGuess: '/product-wish/guess-submit', // 提交心愿竞猜
    getWishingGuessInfo: '/product-wish/guess-info', // 获取心愿竞猜信息

    gameRPSReady: '/game-rps/ready', // 石头剪刀布，准备阶段
    gameRPSMatch: '/game-rps/game-match', // 石头剪刀布，开始匹配
    getGameRPSInfo: '/game-rps/arena-detail', // 石头剪刀布，获取对局信息
    gameRPSStart: '/game-rps/start', // 石头剪刀布，开始游戏
    gameRPSSubmit: '/game-rps/submit', // 石头剪刀布，提交游戏内容
    getGameRPSResult: '/game-rps/result', // 石头剪刀布，查询游戏结果
    gameDTBReady: '/game-dtb/ready', // 双十拳，准备阶段
    gameDTBMatch: '/game-dtb/game-match', // 双十拳，开始匹配
    getGameDTBInfo: '/game-dtb/arena-detail', // 双十拳，获取对局信息
    gameDTBStart: '/game-dtb/start', // 双十拳，开始游戏
    gameDTBSubmit: '/game-dtb/submit', // 双十拳，提交游戏内容
    getGameDTBResult: '/game-dtb/result', // 双十拳，查询游戏结果

    wechatPay: '/pay-order/wechat', // 微信支付
    pointPay: '/pay-order/integral', // 积分支付
    balancePay: '/pay-order/account', // 余额支付
  },
  getAPIUrl: (options) => {
    const origin = 'https://00goo.com/program'; // 正式
    // const origin = "https://767a6272.r27.cpolar.top/program"; // 测试
    const route = API.address[options.apiKey];
    const result = `${origin}${route}`;
    return result;
  },
};

export default API;
