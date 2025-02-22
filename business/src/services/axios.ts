import { message } from 'ant-design-vue';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// 定义你的响应数据类型
interface IBaseResponse<T> {
  code?: number;
  data: T;
  status?: number;
  message?: string;
  ok: boolean;
}

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  hideLoading?: boolean;
}

// 创建一个 axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: '/web/manage/', // API基础URL
  timeout: 10000, // 请求超时时间（毫秒）
  headers: { 'Content-Type': 'application/json;charset=utf-8' }, // 默认请求头
  withCredentials: true // 允许跨域请求时携带凭证
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么，比如添加认证信息
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.token = token;
    }
    if (config.method === 'get' && config.data) {
      // 如果是 get 请求，config.data 是一个对象，我想让对象中属性值不是 null、undefined、空字符串的属性都拼接到 URL 上
      const newData: { [key: string]: any } = { t: Date.now() };
      for (const key in config.data) {
        if (
          config.data[key] !== null &&
          config.data[key] !== undefined &&
          config.data[key] !== ''
        ) {
          newData[key] = config.data[key];
        }
      }
      if (Object.keys(newData).length) {
        config.url += '?' + new URLSearchParams(newData).toString();
      }
    }
    return config;
  },
  (error: any) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    // 例如，检查状态码并处理错误
    const { status, data } = response;
    if (status === 200) {
      if (+data.code === 200) {
        return response || []; // 假设响应体遵循 IResponseData 格式
      } else if (+data.code === 400) {
        // 未登录或登录已过期
        localStorage.removeItem('token');

        const path = route?.path;
        if (!path?.includes('/login')) {
          localStorage.setItem('path', path);
        }
        router?.push('/login');
        return Promise.reject('未登录或登录已过期');
      } else if (+data.code === 403) {
        message.error(data.message || '没有权限');
        return Promise.reject('没有权限');
      } else {
        message.error(data.message || '请求失败');
        return Promise.reject('请求失败');
      }
    } else {
      message.error(data.message || '请求失败');
      return Promise.reject(data.message);
    }
  },
  (error: any) => {
    // 对响应错误做点什么
    if (error.response) {
      // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      // 例如，网络错误或请求被取消
      return Promise.reject(error.request);
    } else {
      // 发送请求时发生了某些事情，导致请求没有被发送
      // 例如，配置错误或网络错误（DNS 解析失败等）
      return Promise.reject(error.message);
    }
  }
);

const request = <T>(config: CustomAxiosRequestConfig): Promise<IBaseResponse<T>> => {
  return new Promise((resolve, reject) => {
    instance
      .request<IBaseResponse<T>>(config)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
};

// 导出 axios 实例
export default request;
