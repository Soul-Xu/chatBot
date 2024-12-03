// lib/axios.ts
import axios from 'axios';

// 创建一个 Axios 实例
const instance = axios.create({
  baseURL: 'http://81.69.218.11:9140/data', // 基础 URL，根据你的后端 API 来配置
  timeout: 10000, // 请求超时时间
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在这里可以添加例如认证令牌（Token）等
    const token = process.env.NEXT_PUBLIC_API_TOKEN; // 假设你的 Token 存储在环境变量中
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 请求错误处理
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 这里可以对响应数据进行处理
    return response;
  },
  (error) => {
    // 这里可以对错误进行处理，例如根据状态码判断错误类型
    return Promise.reject(error);
  }
);

export default instance;
