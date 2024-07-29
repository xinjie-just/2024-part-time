// 真实用户类型
const MUserTypeMap = new Map([
  [10, '普通用户（不确定真实性）'],
  [20, '推荐用户（未加入疾控且未认证）'],
  [30, '真实用户（加入疾控或者已认证）']
]);

// 用户注册类型
const MRegistrationTypeMap = new Map([
  [0, '游客'],
  [1, '注册用户'],
  [2, '专家']
]);

// 单位类型
const MHospitalTypeMap = new Map([
  [-2, '医院'],
  [-1, '学校'],
  [0, '接种单位'],
  [1, '区疾控'],
  [2, '市疾控'],
  [3, '省疾控'],
  [4, '国家疾控'],
  [5, '预防医学会'],
  [6, '国家卫健委']
]);

// 是否疾控单位，可能是其它单位，如医院、门诊
const MJKTypeMap = new Map([
  [1, '区疾控'],
  [2, '市疾控'],
  [3, '省疾控'],
  [4, '国家疾控']
]);

// 管理员类型
const MAdminTypeMap = new Map([
  [0, '非管理员'],
  [1, '子账户'],
  [2, '主账户']
]);

// 加入疾控状态
const MJoinStateMap = new Map([
  [0, '未加入疾控'],
  [1, '待审核'],
  [2, '审核通过'],
  [3, '驳回']
]);

// 申请加入疾控状态
const MApplyStateMap = new Map([
  [0, '未申请'],
  [10, '待审核'],
  [20, '审核通过'],
  [30, '审核拒绝']
]);

// 环境域名
const MHostnameMap = new Map([
  ['localhost', 'dev'],
  ['127.0.0.1', 'dev'],
  ['test-zjs.yeemiao.net.cn', 'test'],
  ['prez.mianyee.com', 'preRelease'],
  ['zjs.mianyee.com', 'production']
]);

// tabbar 路由
const MTabBarRouterMap = new Map([
  ['training', '/training'],
  ['exam', '/exam'],
  ['message', '/message'],
  ['mine', '/mine']
]);

export const routerObj = [
  {
    path: '/training',
    name: 'training',
    title: '培训',
    fileName: 'trainingList'
  },
  {
    path: '/exam',
    name: 'exam',
    title: '考试',
    fileName: 'examList'
  },
  {
    path: '/message',
    name: 'message',
    title: '消息',
    fileName: 'messageList'
  },
  {
    path: '/mine',
    name: 'mine',
    title: '我的',
    fileName: 'mineInfo'
  }
];

export {
  MUserTypeMap,
  MHospitalTypeMap,
  MAdminTypeMap,
  MJoinStateMap,
  MApplyStateMap,
  MHostnameMap,
  MRegistrationTypeMap,
  MTabBarRouterMap,
  MJKTypeMap
};
