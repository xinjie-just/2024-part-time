// 跳转到因未登录而退出前的页面
export const jumpExitPage = () => {
  const exitPage = wx.getStorageSync('exitPage');
  if (exitPage) {
    // tabBar 页面
    const switchPages = ['pages/free-purchase/index', 'pages/wishing-well/index', 'pages/mine/index'];
    if (switchPages.includes(exitPage)) {
      wx.switchTab({
        url: exitPage.charAt(0) !== '/' ? `/${exitPage}` : exitPage,
        success: () => {
          wx.removeStorageSync('exitPage');
        },
      });
    } else {
      wx.redirectTo({
        url: exitPage.charAt(0) !== '/' ? `/${exitPage}` : exitPage,
        success: () => {
          wx.removeStorageSync('exitPage');
        },
      });
    }
  } else {
    wx.switchTab({
      url: '/pages/free-purchase/index',
    });
  }
};
