// src/utils/debug.ts

// 从环境变量中获取调试模式设置,注意，环境变量总是字符串，所以我们需要比较 'true'。
// const isDebugMode = import.meta.env.VITE_APP_DEBUG_MODE === "true";
const isDebugMode = true;

// 创建一个调试日志函数
export const debugLog = (...args: any[]) => {
  if (isDebugMode) {
    console.log(...args);
  }
};

// 创建一个警告日志函数
export const debugWarn = (...args: any[]) => {
  if (isDebugMode) {
    console.warn("[DEBUG WARN]", ...args);
  }
};

// 创建一个错误日志函数
export const debugError = (...args: any[]) => {
  if (isDebugMode) {
    console.error("[DEBUG ERROR]", ...args);
  }
};
