// composables/useRouteParamsValidation.ts
import { ElMessageBox } from "element-plus";
import { onMounted, onUnmounted } from "vue";
import {
  useRouter,
  useRoute,
  LocationQuery,
  onBeforeRouteLeave,
} from "vue-router";

interface ValidateOptions {
  requiredParams: string[]; // 必需的参数列表
  redirectPath?: string | -1; // 参数缺失时的重定向路径，不传则返回上一页
  customValidation?: (params: LocationQuery) => boolean; // 可选的自定义验证函数
}

export const useRouteParamsValidation = (options: ValidateOptions) => {
  const router = useRouter();
  const route = useRoute();

  // 处理重定向
  const handleRedirect = () => {
    if (!options.redirectPath || options.redirectPath === -1) router.go(-1);
    else router.replace(options.redirectPath);
  };

  // 使用路由路径作为存储key的一部分
  const getStorageKey = (param: string) =>
    `route_${route.path}_${param}`.replace(/\//g, "_");

  const saveParamsToStorage = () => {
    options.requiredParams.forEach((param) => {
      const value = route.query[param];
      if (value) {
        localStorage.setItem(getStorageKey(param), value.toString());
      }
    });
  };

  // 改进后的恢复参数逻辑
  const restoreParamsFromStorage = () => {
    const restoredParams: Record<string, string> = {};
    // 检查是否所有必需参数都能从localStorage中恢复
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

  const validateParams = async () => {
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
      try {
        await ElMessageBox.alert("参数验证失败", "验证错误", {
          confirmButtonText: "返回",
          type: "error",
          callback: () => {
            handleRedirect();
          },
        });
      } catch {
        // 用户关闭对话框时也执行重定向
        handleRedirect();
      }
    } else {
      saveParamsToStorage();
    }
  };

  onMounted(() => {
    validateParams();
    window.addEventListener("beforeunload", saveParamsToStorage);
  });

  onUnmounted(() => {
    window.removeEventListener("beforeunload", saveParamsToStorage);
  });

  // 在路由变化前清理存储
  onBeforeRouteLeave((_to, from) => {
    options.requiredParams.forEach((param) => {
      const key = `route_${from.path}_${param}`.replace(/\//g, "_");
      localStorage.removeItem(key);
    });
  });
};
