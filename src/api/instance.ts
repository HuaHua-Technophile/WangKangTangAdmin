import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { debugLog } from "@/utils/debug";
import { ElMessage, ElLoading, ElMessageBox } from "element-plus";
import { toRaw } from "vue";
import { useAuthStore } from "@/stores/auth";
import qs from "qs";

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL, // 基本URL
  timeout: 30000, //超时时间
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
  // withCredentials: true, //发送跨域请求时，浏览器默认不会发送凭证信息。 这个配置项允许跨域请求时携带凭证信息（如 cookies、HTTP 认证及客户端 SSL 证明等）使用这个选项时，服务器也需要配置 CORS 来允许接收凭证，否则请求会失败。
});

let loadingInstance: any;

// Request 拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    loadingInstance = ElLoading.service({ fullscreen: true });
    const authStore = useAuthStore(); // 获取 auth store
    const token = authStore.token; // 获取 token
    if (token) config.headers["Authorization"] = `Bearer ${token}`; // 如果 token 存在，则添加到请求头

    return config;
  },
  (error) => {
    // 处理请求错误
    debugLog("axios中发送Request报错", error);
    ElMessage.error("请求发送失败");
    return Promise.reject(error);
  }
);

// Response 拦截器
service.interceptors.response.use(
  (response) => {
    loadingInstance.close();
    // debugLog("axios中返回response", response);

    // 由HTTP协议定义，是服务器响应的标准HTTP状态码：200
    if (response.status === 200) {
      // 开发者自定义的API业务逻辑的状态，在若依框架下，401表示验证过期
      if (response.data.code === 401) {
        ElMessageBox.confirm("您已登出，请重新登录", "确认登出", {
          confirmButtonText: "重新登录",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          const authStore = useAuthStore(); // 获取 auth store
          authStore.logout(); // 调用 logout 方法
        });
      } else return response.data;
    }
    // HTTP请求异常，请求在网络或服务器层面有问题，需要进行网络错误处理
    else {
      ElMessage({
        message: response.data.msg || "axios出错啦",
        type: "error",
        duration: 8 * 1000,
      });
      return Promise.reject(new Error(response.data.msg || "axios出错啦"));
    }
  },
  (error) => {
    loadingInstance.close();
    debugLog("axios中返回response报错" + error);
    ElMessage({
      message: error.message,
      type: "error",
      duration: 8 * 1000,
    });
    return Promise.reject(error);
  }
);

// 创建一个新的请求函数，允许传入描述文本
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
