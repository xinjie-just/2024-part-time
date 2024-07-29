/**
 * 获取富文本内容中的图片
 */
export const getImgList = (richText: string): string[] => {
  // 如果富文本内容为空，则没有图片
  if (!richText) {
    return [];
  }

  const regex = /<img/g;
  const imgTags: string[] = richText.match(regex)!;
  let imgLen = 0;
  if (imgTags === null) {
    return [];
  } else {
    imgLen = imgTags.length;
  }

  // 没有找到图片
  if (imgLen === 0) {
    return [];
  }

  const imgElementList: string[] = [];
  const imgSrcList: string[] = [];

  richText.replace(
    /<img [^>]*src=['"]([^'"]+)[^>]*>/g,
    (match: string, capture: string): string => {
      imgSrcList.push(capture);
      imgElementList.push(match);
      return capture;
    }
  );

  // console.log('imgElementList', imgElementList);
  // console.log('imgSrcList', imgSrcList);

  return imgSrcList;
};
