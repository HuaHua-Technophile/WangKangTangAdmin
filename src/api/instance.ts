/**
 * @file Axios 请求封装模块
 * @description 提供一个基于 Axios 的 HTTP 请求工具，包含请求和响应拦截器，支持全局加载动画、错误提示和登录状态管理。
 * @author [Your Name]
 * @version 1.0.0
 */

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { debugLog } from "@/utils/debug";
import { ElMessage, ElLoading, ElMessageBox } from "element-plus";
import { toRaw } from "vue";
import { useAuthStore } from "@/stores/auth";
import qs from "qs";

/**
 * 创建 Axios 实例
 * @constant
 */
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL, // 基本URL
  timeout: 30000, // 超时时间
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
  // withCredentials: true, // 允许跨域请求时携带凭证信息
});

let loadingInstance: any; // 全局加载实例

/**
 * 请求拦截器
 * 在发送请求之前，显示全局加载动画并添加授权 Token。
 */
service.interceptors.request.use(
  (config) => {
    // 显示全局加载动画
    loadingInstance = ElLoading.service({ fullscreen: true });
    const authStore = useAuthStore(); // 获取 auth store
    const token = authStore.token; // 获取 token
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // 添加 Token 到请求头
    }
    return config;
  },
  (error) => {
    // 请求错误处理
    debugLog("axios中发送Request报错", error);
    ElMessage.error("请求发送失败");
    return Promise.reject(error);
  }
);

let isShowingLoginBox = false; // 防止重复弹出登录框标志位

/**
 * 响应拦截器
 * 处理服务器返回的响应，根据业务逻辑处理错误提示和登录状态。
 */
service.interceptors.response.use(
  (response) => {
    // 关闭全局加载动画
    loadingInstance.close();

    if (response.status === 200) {
      // API 自定义状态码 401 表示登录过期
      if (response.data.code === 401) {
        if (!isShowingLoginBox) {
          isShowingLoginBox = true; // 设置标志位
          ElMessageBox.confirm("您已登出，请重新登录", "确认登出", {
            confirmButtonText: "重新登录",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              const authStore = useAuthStore(); // 获取 auth store
              authStore.logout(); // 调用 logout 方法
            })
            .finally(() => {
              isShowingLoginBox = false; // 重置标志位
            });
        }
        return Promise.reject(new Error("未登录或登录过期"));
      } else {
        return response.data; // 返回成功数据
      }
    } else {
      // HTTP 请求异常处理
      ElMessage({
        message: response.data.msg || "axios出错啦",
        type: "error",
        duration: 8 * 1000,
      });
      return Promise.reject(new Error(response.data.msg || "axios出错啦"));
    }
  },
  (error) => {
    // 响应错误处理
    loadingInstance.close();
    debugLog("axios中返回response报错", error);
    ElMessage({
      message: error.message,
      type: "error",
      duration: 8 * 1000,
    });
    return Promise.reject(error);
  }
);

/**
 * 自定义请求函数
 * @template T 响应数据的泛型
 * @param {AxiosRequestConfig} config 请求配置对象
 * @param {string} description 请求的描述文本，用于日志记录
 * @returns {Promise<AxiosResponse<T>>} 返回包含响应数据的 Promise
 * @example
 * const response = await customRequest<MyResponseType>({ url: '/api/example', method: 'GET' }, '获取示例数据');
 */
export const customRequest = async <T>(
  config: AxiosRequestConfig,
  description: string
): Promise<AxiosResponse<T>> => {
  debugLog(
    `准备${description},传参`,
    toRaw(config.data) || toRaw(config.params) || "(无)"
  );

  const response: AxiosResponse<T> = await service(config);
  return response;
};
