/* 
 * 石头剪刀布游戏
 */
const gestures = ['石头', '剪刀', '布'];

const rockPaperScissors = (gesture1, gesture2) => {
  const index1 = gestures.indexOf(gesture1);
  const index2 = gestures.indexOf(gesture2);

  if (index1 === index2) {
    return '平局';
  } else if ((index1 - index2 + 3) % 3 === 0) {
    return `${gesture1} 赢了`;
  } else {
    return `${gesture2} 赢了`;
  }
}

// 示例使用  
console.log(rockPaperScissors('石头', '剪刀')); // 输出: 石头 赢了

/*
 * 双十拳游戏
 */
// 定义手势与数字的对应关系  
const GESTURE_TO_NUMBER = {
  '零': 0,
  '五': 5,
  '十': 10
};

// 函数来根据手势计算数字之和  
function calculateSum(gesture1, gesture2) {
  const num1 = GESTURE_TO_NUMBER[gesture1];
  const num2 = GESTURE_TO_NUMBER[gesture2];
  return num1 + num2;
}

const doubleTenBoxing = (shouter, shoutedNumber, gesture1, gesture2) => {
  const sum = calculateSum(gesture1, gesture2);

  if (isNaN(shoutedNumber) || isNaN(sum) || shoutedNumber < 0 || shoutedNumber > 20 || sum < 0 || sum > 20) {
    return '无效输入';
  }

  if (shoutedNumber === sum) {
    return `${shouter} 赢了`; // 喊出数字的玩家赢了  
  } else {
    return '另一方赢了'; // 或者可以更具体地指出是哪个玩家，如果游戏逻辑支持的话  
  }
}

// 示例使用  
console.log(doubleTenBoxing('玩家A', 15, '五', '十')); // 输出: 玩家A 赢了  
console.log(doubleTenBoxing('玩家B', 10, '零', '十')); // 输出: 玩家B 赢了

export {
  rockPaperScissors,
  doubleTenBoxing
}