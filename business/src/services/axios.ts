import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 定义你的响应数据类型
interface IResponseData<T = any> {
  data: T;
  status: number;
  message: string;
  // 其他可能的响应字段...
}

// 创建一个 axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || 'https://api.example.com', // API基础URL
  timeout: 10000, // 请求超时时间（毫秒）
  headers: { 'Content-Type': 'application/json;charset=utf-8' }, // 默认请求头
  withCredentials: true // 允许跨域请求时携带凭证
});

// 请求拦截器
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 在发送请求之前做些什么，比如添加认证信息
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error: any) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse<IResponseData>) => {
    // 对响应数据做点什么
    // 例如，检查状态码并处理错误
    const { data, message } = response.data;
    if (response.status === 200) {
      return data; // 假设响应体遵循 IResponseData 格式
    } else {
      return Promise.reject(new Error('Error: ' + message));
    }
  },
  (error: any) => {
    // 对响应错误做点什么
    if (error.response) {
      // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      console.error('Error response:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      // 例如，网络错误或请求被取消
      console.error('No response received:', error.request);
      return Promise.reject(error.request);
    } else {
      // 发送请求时发生了某些事情，导致请求没有被发送
      // 例如，配置错误或网络错误（DNS 解析失败等）
      console.error('Error creating request:', error.message);
      return Promise.reject(error.message);
    }
  }
);

// 导出 axios 实例
export default instance;

// 使用示例
// 假设你有一个获取用户列表的 API
// instance.get<IResponseData<User[]>>('/users')
//   .then(users => {
//     // 处理用户列表
//   })
//   .catch(error => {
//     // 处理错误
//   });
