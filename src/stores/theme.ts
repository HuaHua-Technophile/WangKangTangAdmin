// src/stores/theme.ts
import { ref } from "vue";
import { defineStore } from "pinia";
import { debugLog } from "@/utils/debug";

export const useThemeStore = defineStore(
  "theme",
  () => {
    const isDark = ref(true);

    const toggleTheme = () => {
      isDark.value = !isDark.value;
      debugLog("主题切换", isDark.value);
      updateHtmlClass();
    };

    const updateHtmlClass = () => {
      document.documentElement.classList.add(isDark.value ? "dark" : "light");
      document.documentElement.setAttribute(
        "data-bs-theme",
        isDark.value ? "dark" : "light"
      );
    };

    return { isDark, toggleTheme, updateHtmlClass };
  },
  {
    persist: true,
  }
);
