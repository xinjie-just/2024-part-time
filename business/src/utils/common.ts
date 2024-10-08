import { message } from 'ant-design-vue';

// 文件大小转换，接受一个 B 单位的值
export const fileSizeTransform = (size: number) => {
  if (!size) {
    return '-';
  } else if (!(size > 1024)) {
    return `${size}B`;
  } else if (!(size > 1024 * 1024)) {
    return `${(size / 1024).toFixed(2)}KB`;
  } else if (!(size > 1024 * 1024 * 1024)) {
    return `${(size / 1024 / 1024).toFixed(2)}MB`;
  } else {
    return `${(size / 1024 / 1024 / 1024).toFixed(2)}GB`;
  }
};

// 获取文件后缀
export const getFileSuffix = (name: string) => {
  const lastIndex = name.lastIndexOf('.');
  let suffix = '';
  if (lastIndex !== -1) {
    suffix = name.substring(lastIndex).toLowerCase();
  } else {
    message.error('您上传的文件名有误，请修改后再上传');
  }
  return suffix; // 后缀名，包含有 .，如：.png
};

export const getToken = (): string => {
  const cookies = document.cookie;
  const cookieList = cookies.split(';');
  let token = '';
  for (const item of cookieList) {
    const cookie = item.trim();
    if (cookie.includes('token')) {
      token = cookie.substring(6);
      break;
    } else {
      token = '16b69d1f-f1c1-4e65-96db-370f41de1e03';
    }
  }
  return token;
};
