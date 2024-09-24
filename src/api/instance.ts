import axios, { AxiosResponse, AxiosError } from "axios";
import { debugLog } from "@/utils/debug";
import { ElMessage, ElLoading, ElMessageBox } from "element-plus";
export const service = axios.create({
  baseURL: process.env.VITE_APP_API_BASE_URL, // 基本URL
  timeout: 30000, //超时时间
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  // withCredentials: true, //发送跨域请求时，浏览器默认不会发送凭证信息。 这个配置项允许跨域请求时携带凭证信息（如 cookies、HTTP 认证及客户端 SSL 证明等）使用这个选项时，服务器也需要配置 CORS 来允许接收凭证，否则请求会失败。
});

let loadingInstance: any;

// Request 拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    loadingInstance = ElLoading.service({ fullscreen: true });

    // 例如：添加token到header
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    // 处理请求错误
    debugLog("axios中发送Request报错", error);
    ElMessage.error("请求发送失败");
    return Promise.reject(error);
  }
);

// Response 拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    loadingInstance.close();

    // 处理响应数据
    const res = response.data;
    if (res.code !== 20000) {
      ElMessage({
        message: res.message || "Error",
        type: "error",
        duration: 5 * 1000,
      });

      // 50008: 非法token; 50012: 其他客户端登录; 50014: Token 过期;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // 重新登录
        ElMessageBox.confirm("您已登出，请重新登录", "确认登出", {
          confirmButtonText: "重新登录",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          // 这里可以调用你的登出方法
          // store.dispatch('user/resetToken').then(() => {
          //   location.reload();
          // });
        });
      }
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  (error: AxiosError) => {
    loadingInstance.close();
    debugLog("axios中返回response报错" + error);
    ElMessage({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);
