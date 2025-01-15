export const formatRichText = (html) => {
  let newContent = html.replace(/<img[^>]*>/gi, function (match, capture) {
    match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
    match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
    match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
    return match;
  });
  newContent = newContent.replace(/style="[^"]+"/gi, function (match, capture) {
    match = match.replace(/width:[^;]+;/gi, 'width:100%;').replace(/width:[^;]+;/gi, 'width:100%;');
    return match;
  });
  newContent = newContent.replace(/<br[^>]*\/>/gi, '');
  newContent = newContent.replace(/\<img/gi, '<img style="max-width:350rpx;height:auto;display:block;margin:10px 0;"');
  return newContent;
}

export const formatRichText2 = (html) => {
  let nodes = [];
  const fragments = html.split('</p><img');
  fragments.forEach(fragment => {
    if (fragment.includes('<p')) {
      const pTag = fragment.match(/<p[^>]*>(.*?)<\/p>/)[0];
      const text = pTag.match(/<p[^>]*>(.*?)<\/p>/)[1];
      nodes.push({
        name: 'p',
        attrs: {
          style: pTag.match(/style="([^"]*)"/)?.[1] || ''
        },
        children: [{
          type: 'text',
          text: text
        }]
      });
    }
    if (fragment.includes('<img')) {
      const imgTag = '<img' + fragment.match(/<img[^>]*>/)[0].slice(4);
      nodes.push({
        name: 'img',
        attrs: {
          src: imgTag.match(/src="([^"]*)"/)?.[1] || '',
          style: imgTag.match(/style="([^"]*)"/)?.[1] || ''
        }
      });
    }
  });
  return nodes;
};