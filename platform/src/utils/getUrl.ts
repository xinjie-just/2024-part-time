/**
 * 获取路由路径
 */
export const routerPath = (): string | undefined => {
  const hash = window.location.hash;
  if (!hash) {
    console.log('页面地址有误，请检查路由地址');
    return;
  }
  let startStringIndex = 0;
  let endStringIndex = 0;
  if (hash.includes('#')) {
    startStringIndex = hash.lastIndexOf('#') + 1;
  } else {
    startStringIndex = 0;
  }
  if (hash.includes('?')) {
    endStringIndex = hash.indexOf('?');
  } else {
    endStringIndex = hash.length;
  }
  return hash.substring(startStringIndex, endStringIndex);
};
