/**
 * @file composables/useRouteParamsValidation.ts
 * @description 提供验证 Vue Router 路由参数的组合式函数，用于确保路由参数完整性，
 * 并支持参数的本地存储恢复功能以及自定义验证逻辑。
 */

import { ElMessageBox } from "element-plus";
import { onMounted, onUnmounted } from "vue";
import {
  useRouter,
  useRoute,
  LocationQuery,
  onBeforeRouteLeave,
} from "vue-router";

/**
 * @interface ValidateOptions
 * @description 验证选项的接口定义
 */
interface ValidateOptions {
  /**
   * @property {string[]} requiredParams
   * @description 必需的参数列表
   */
  requiredParams: string[];

  /**
   * @property {string | -1} [redirectPath]
   * @description 参数缺失时的重定向路径，不传则返回上一页
   */
  redirectPath?: string | -1;

  /**
   * @property {(params: LocationQuery) => boolean} [customValidation]
   * @description 可选的自定义验证函数，返回 `true` 表示验证通过，`false` 表示验证失败
   */
  customValidation?: (params: LocationQuery) => boolean;
}

/**
 * @function useRouteParamsValidation
 * @description 验证路由参数并提供本地存储恢复功能的组合式函数
 * @param {ValidateOptions} options 验证选项对象
 * @returns {void}
 */
export const useRouteParamsValidation = (options: ValidateOptions): void => {
  const router = useRouter();
  const route = useRoute();

  /**
   * @function handleRedirect
   * @description 处理参数缺失或验证失败时的重定向逻辑
   */
  const handleRedirect = (): void => {
    if (!options.redirectPath || options.redirectPath === -1) {
      router.go(-1);
    } else {
      router.replace(options.redirectPath);
    }
  };

  /**
   * @function getStorageKey
   * @description 根据路由路径生成存储参数的唯一键
   * @param {string} param 参数名称
   * @returns {string} 本地存储的键名
   */
  const getStorageKey = (param: string): string =>
    `route_${route.path}_${param}`.replace(/\//g, "_");

  /**
   * @function saveParamsToStorage
   * @description 将当前路由参数保存到本地存储
   */
  const saveParamsToStorage = (): void => {
    options.requiredParams.forEach((param) => {
      const value = route.query[param];
      if (value) {
        localStorage.setItem(getStorageKey(param), value.toString());
      }
    });
  };

  /**
   * @function restoreParamsFromStorage
   * @description 从本地存储恢复路由参数
   * @returns {{ restoredParams: Record<string, string>, hasRestoredParams: boolean }}
   * 返回恢复的参数对象及是否成功恢复所有必需参数
   */
  const restoreParamsFromStorage = (): {
    restoredParams: Record<string, string>;
    hasRestoredParams: boolean;
  } => {
    const restoredParams: Record<string, string> = {};
    const hasRestoredParams = options.requiredParams.every((param) => {
      const value = localStorage.getItem(getStorageKey(param));
      if (value) {
        restoredParams[param] = value;
        return true;
      }
      return false;
    });

    return {
      restoredParams,
      hasRestoredParams,
    };
  };

  /**
   * @function validateParams
   * @description 验证路由参数的完整性和合法性
   * @returns {Promise<void>}
   */
  const validateParams = async (): Promise<void> => {
    const missingParams = options.requiredParams.filter(
      (param) => !route.query[param]
    );

    if (missingParams.length > 0) {
      const { restoredParams, hasRestoredParams } = restoreParamsFromStorage();

      if (hasRestoredParams) {
        router.replace({
          path: route.path,
          query: {
            ...route.query,
            ...restoredParams,
          },
        });
      } else {
        try {
          await ElMessageBox.alert(
            `缺少必要的参数：${missingParams.join(", ")}`,
            "参数错误",
            {
              confirmButtonText: "返回",
              type: "error",
              callback: () => {
                handleRedirect();
              },
            }
          );
        } catch {
          // 用户关闭对话框时也执行重定向
          handleRedirect();
        }
      }
    } else if (
      options.customValidation &&
      !options.customValidation(route.query)
    ) {
      await ElMessageBox.alert("参数验证失败", "验证错误", {
        confirmButtonText: "返回",
        type: "error",
        callback: () => {
          handleRedirect();
        },
      });
    } else {
      saveParamsToStorage();
    }
  };

  // 生命周期钩子：组件挂载时验证参数并监听 unload 事件
  onMounted(() => {
    validateParams();
    window.addEventListener("beforeunload", saveParamsToStorage);
  });

  // 生命周期钩子：组件卸载时移除监听器
  onUnmounted(() => {
    window.removeEventListener("beforeunload", saveParamsToStorage);
  });

  // 路由离开时清理本地存储的参数
  onBeforeRouteLeave((_to, from) => {
    options.requiredParams.forEach((param) => {
      const key = `route_${from.path}_${param}`.replace(/\//g, "_");
      localStorage.removeItem(key);
    });
  });
};
