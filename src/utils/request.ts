import axios, { AxiosInstance, AxiosResponse } from 'axios';
// 1️⃣ 修改 baseURL
const service: AxiosInstance = axios.create({
  // 关键点：设置为空字符串，或者 '/api'。
  // 这样请求会自动基于当前域名（http://localhost:3000），从而触发 setupProxy.js
  baseURL: process.env.REACT_APP_API_BASE_URL || '', 
  timeout: 100000, 
});

// ... 请求拦截器保持不变 ...
service.interceptors.request.use(
  (config: any) => {
    // 这里保持你原本的 Token 逻辑
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

// 2️⃣ 修改响应拦截器以匹配 Python 后端
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;

    // 假设你的后端返回结构是: { code: 200, result: ..., model_used: ... }
    // 之前你的判断是 res.status_code !== 1，这会导致报错
    if (res.status === 200 ) {
       return res; // ✅ 校验通过，返回数据
    }
    
    // 如果不符合成功条件
    console.error('接口错误：', res.message || '业务处理失败');
    return Promise.reject(new Error(res.message || 'Error'));
  },
  (error) => {
    // ... 这里的错误处理逻辑保持不变 ...
    if (error.response) {
       // ... status code switch case ...
       console.error('HTTP Error', error.response.status);
    }
    return Promise.reject(error);
  }
);

export default service;