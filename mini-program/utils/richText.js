const splitRichTextWithWrappedImages = (htmlStr) => {
  const result = [];
  let lastIndex = 0;
  let depth = 0;
  let currentTag = '';
  
  // 正则匹配图片或包裹图片的父标签起始位置
  const tagReg = /<(\/?)(\w+)([^>]*)>/g;
  const imgReg = /<img\b[^>]*>/i;

  let match;
  let startTagIndex = -1;

  while ((match = tagReg.exec(htmlStr)) !== null) {
    const [fullTag, isClose, tagName, attrs] = match;
    const tagStart = match.index;

    if (!isClose) {
      // 检测到开始标签
      if (depth === 0) {
        // 新父标签开始
        startTagIndex = tagStart;
        currentTag = tagName;
      }
      depth++;
    } else {
      depth = Math.max(0, depth - 1);
      if (depth === 0 && currentTag === tagName) {
        // 匹配到父标签闭合
        const endIndex = tagReg.lastIndex;
        const fragment = htmlStr.slice(startTagIndex, endIndex);
        
        // 检查片段是否包含图片
        if (imgReg.test(fragment)) {
          // 添加前面的文本
          const textBefore = htmlStr.slice(lastIndex, startTagIndex);
          if (textBefore) result.push(textBefore);
          
          // 添加包裹的图片片段
          result.push(fragment);
          lastIndex = endIndex;
        }
      }
    }
  }

  // 处理剩余文本
  const remainingText = htmlStr.slice(lastIndex);
  if (remainingText) result.push(remainingText);

  return result;
}

export {splitRichTextWithWrappedImages};