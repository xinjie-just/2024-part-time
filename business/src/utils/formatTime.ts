/**
 * 格式化时间格式
 * @param {*} value 传入时间（单位秒）
 * @returns 返回时间格式 XX 天 XX 小时 XX 分钟 XX 秒
 */
export const formatSecond = (value: number): string => {
  value = value ?? 0;
  let secondTime = value; // 秒
  let minuteTime = 0; // 分
  let hourTime = 0; // 小时
  let dayTime = 0; // 天
  let result = '';
  //如果秒数不小于 60，将秒数转换成整数
  if (secondTime >= 60) {
    //获取分钟，除以 60 取整数，得到整数分钟
    minuteTime = secondTime / 60;
    //获取秒数，秒数取佘，得到整数秒数
    secondTime = secondTime % 60;
    //如果分钟不小于 60，将分钟转换成小时
    if (minuteTime >= 60) {
      //获取小时，获取分钟除以 60，得到整数小时
      hourTime = minuteTime / 60;
      //获取小时后取佘的分，获取分钟除以 60 取佘的分
      minuteTime = minuteTime % 60;
      //如果小时数不小于 24，将小时转换成天
      if (hourTime >= 24) {
        //获取天，获取小时除以 24，得到整数天
        dayTime = hourTime / 24;
        //获取天后取佘的小时
        hourTime = hourTime % 24;
      }
    }
  }
  if (secondTime > 0) {
    result = `${secondTime} 秒`;
  }
  if (minuteTime > 0) {
    result = `${minuteTime} 分 ${result}`;
  }
  if (hourTime > 0) {
    result = `${hourTime} 时 ${result}`;
  }
  if (dayTime > 0) {
    result = `${dayTime} 天 ${result}`;
  }
  return result;
};

export const formatSecond2 = function (value: number): string {
  value = value ?? 0;
  let seconds = Math.floor(value); // 秒
  let minutes = Math.floor(seconds / 60); // 分
  seconds = seconds % 60;
  let hours = Math.floor(minutes / 60); // 小时
  minutes = minutes % 60;
  const days = Math.floor(hours / 24); // 天
  hours = hours % 24;

  return `${days > 0 ? `${days} 天 ` : ''}${hours > 0 ? `${hours} 时 ` : ''}${
    minutes > 0 ? `${minutes} 分 ` : ''
  }${seconds} 秒`;
};
