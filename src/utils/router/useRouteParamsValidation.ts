// useRouteParamsValidation.ts
import {
  onBeforeRouteUpdate,
  useRouter,
  useRoute,
  RouteLocationNormalized,
} from "vue-router";
import { onMounted } from "vue";
import { ElMessageBox } from "element-plus";

interface ValidationOptions {
  requiredParams: string[];
  customValidation?: (route: RouteLocationNormalized) => boolean | string;
  fallbackPath?: string;
  errorMessage?: string;
  // 新增：自定义标题
  errorTitle?: string;
}

export const useRouteParamsValidation = (options: ValidationOptions) => {
  const router = useRouter();
  const currentRoute = useRoute();

  // 显示错误提示
  const showError = async (message: string) => {
    try {
      await ElMessageBox.alert(message, options.errorTitle || "参数验证失败", {
        confirmButtonText: "返回",
        type: "error",
        draggable: true, // 是否可以通过点击遮罩关闭
        closeOnClickModal: false, // 是否可以通过按下 ESC 关闭
        closeOnPressEscape: false, // 是否显示关闭按钮
        showClose: false, // 回调函数
        callback: handleValidationFail,
      });
    } catch (err) {
      handleValidationFail(); // 处理关闭对话框的情况
    }
  };

  // 验证函数
  const validateRoute = async (
    route: RouteLocationNormalized
  ): Promise<boolean> => {
    // 检查必需参数
    const missingParams = options.requiredParams.filter((param) => {
      return !route.params[param] && !route.query[param];
    });

    if (missingParams.length > 0) {
      await showError(
        options.errorMessage || `缺少必要参数: ${missingParams.join(", ")}`
      );
      return false;
    }

    // 执行自定义验证
    if (options.customValidation) {
      const customResult = options.customValidation(route);
      if (typeof customResult === "string") {
        await showError(customResult);
        return false;
      }
      if (!customResult) {
        await showError(options.errorMessage || "参数验证失败");
        return false;
      }
    }

    return true;
  };

  // 处理验证失败的跳转
  const handleValidationFail = () => {
    const fallback = options.fallbackPath || -1;
    if (typeof fallback === "number") router.go(fallback);
    else router.push(fallback);
  };

  // 组件挂载时验证当前路由
  onMounted(async () => {
    if (!(await validateRoute(currentRoute))) return;
  });

  // 路由更新时验证
  onBeforeRouteUpdate(async (to, _from, next) => {
    if (!(await validateRoute(to))) {
      next(false);
      return;
    }
    next();
  });
};
