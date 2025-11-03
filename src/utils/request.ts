import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/', // ✅ 后端地址
  timeout: 10000, // 超时时间（毫秒）
});

// 请求拦截器
service.interceptors.request.use(
  (config: any) => {
    // 例如：在这里加上 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 可以统一处理返回的数据结构
    const res = response.data;
    if (res.code !== 0 && res.status !== 'success') {
      console.error('接口错误：', res.message || '未知错误');
      return Promise.reject(res);
    }
    return res;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 401:
          console.warn('未授权或登录过期');
          localStorage.removeItem('token');
          break;
        case 404:
          console.warn('接口不存在');
          break;
        case 500:
          console.error('服务器错误');
          break;
        default:
          console.error('网络错误', status);
      }
    } else {
      console.error('请求失败', error.message);
    }
    return Promise.reject(error);
  }
);

export default service;
