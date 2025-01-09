/**
 * @file debug.ts
 * @description 提供一组用于开发调试的日志工具函数，包括日志、警告和错误输出。
 * 这些工具函数会根据环境变量或调试模式开关决定是否输出日志信息。
 * @author 您的名字
 * @date 2023-10
 */

// 从环境变量中获取调试模式设置
// 注意：环境变量总是字符串，所以我们需要比较 'true'。
const isDebugMode = true; // 示例中手动设置为 true
// const isDebugMode = import.meta.env.VITE_APP_DEBUG_MODE === "true";

/**
 * 输出调试日志信息。
 * 仅当调试模式开启时才会输出日志。
 * @param {...any[]} args - 需要输出到控制台的日志内容，可以是任意类型。
 * @example
 * debugLog("This is a debug log", { key: "value" });
 */
export const debugLog = (...args: any[]): void => {
  if (isDebugMode) {
    console.log(...args);
  }
};

/**
 * 输出调试警告信息。
 * 仅当调试模式开启时才会输出警告。
 * @param {...any[]} args - 需要输出到控制台的警告内容，可以是任意类型。
 * @example
 * debugWarn("This is a debug warning", { key: "value" });
 */
export const debugWarn = (...args: any[]): void => {
  if (isDebugMode) {
    console.warn("[DEBUG WARN]", ...args);
  }
};

/**
 * 输出调试错误信息。
 * 仅当调试模式开启时才会输出错误。
 * @param {...any[]} args - 需要输出到控制台的错误内容，可以是任意类型。
 * @example
 * debugError("This is a debug error", { key: "value" });
 */
export const debugError = (...args: any[]): void => {
  if (isDebugMode) {
    console.error("[DEBUG ERROR]", ...args);
  }
};
