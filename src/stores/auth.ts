// src/stores/auth.ts
import { ref } from "vue";
import { defineStore } from "pinia";

/*在 Setup Store 中:
    ref() 就是 state 属性
    computed() 就是 getters
    function() 就是 actions */
export const useAuthStore = defineStore(
  "auth",
  () => {
    // 状态
    const isAuthenticated = ref(false);
    const token = ref<string>("");

    // 操作
    const setToken = (newToken: string) => {
      token.value = newToken;
      isAuthenticated.value = true;
    };

    const clearToken = () => {
      token.value = "";
      isAuthenticated.value = false;
    };

    // 暴露状态和方法
    return {
      token,
      isAuthenticated,
      setToken,
      clearToken,
    };
  },
  {
    persist: {
      pick: ["token"], // 只持久化 token
    },
  }
);
