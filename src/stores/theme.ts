/**
 * @file theme.ts
 * @description 用于管理主题模式（深色模式和浅色模式）的 Pinia Store。
 * 提供主题切换功能，并动态更新 HTML 元素的类名和属性。
 * @module stores/theme
 */

import { ref } from "vue";
import { defineStore } from "pinia";
import { debugLog } from "@/utils/debug";

/**
 * 主题存储模块
 * @see https://pinia.vuejs.org/ 官方文档
 */
export const useThemeStore = defineStore(
  "theme",
  () => {
    /**
     * 当前主题模式的状态
     * @default true 表示深色模式
     */
    const isDark = ref(true);

    /**
     * 切换主题模式
     * 将主题从深色切换到浅色或从浅色切换到深色。
     * 同时更新 HTML 元素的类名和 `data-bs-theme` 属性。
     * @returns {void}
     */
    const toggleTheme = (): void => {
      isDark.value = !isDark.value;
      debugLog("主题切换", isDark.value);
      updateHtmlClass();
    };

    /**
     * 更新 HTML 元素的类名和 `data-bs-theme` 属性
     * 根据当前主题模式动态添加 `dark` 或 `light` 类名。
     * 并设置对应的 `data-bs-theme` 属性值。
     * @returns {void}
     */
    const updateHtmlClass = (): void => {
      document.documentElement.classList.add(isDark.value ? "dark" : "light");
      document.documentElement.setAttribute(
        "data-bs-theme",
        isDark.value ? "dark" : "light"
      );
    };

    // 返回状态和方法
    return { isDark, toggleTheme, updateHtmlClass };
  },
  {
    /**
     * 启用持久化存储
     * @see https://pinia.vuejs.org/core-concepts/plugins.html#persistedstate 官方文档
     */
    persist: true,
  }
);
