<!--
  文件名: Login.vue
  描述: 用户登录页面，提供用户输入账号和密码进行登录的功能。
  功能:
    - 使用 Element Plus 提供的表单和输入组件构建登录表单。
    - 验证用户输入的账号和密码是否符合规则。
    - 调用登录 API，处理登录逻辑并存储返回的 token。
    - 支持动态路由加载。
  作者: [您的名字]
  日期: [当前日期]
-->

<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <el-card style="width: 350px">
      <template #header>
        <h2 class="text-primary">用户登录</h2>
      </template>
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginFormRef"
        label-position="top">
        <el-form-item label="账号" prop="username">
          <el-input
            v-model.trim="loginForm.username"
            clearable
            @keyup.enter="handleLogin"
            placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model.trim="loginForm.password"
            clearable
            @keyup.enter="handleLogin"
            type="password"
            show-password
            placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleLogin"
            :loading="loading"
            class="w-100"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
  /**
   * 引入 Vue 的响应式 API
   */
  import { ref, reactive } from "vue";

  /**
   * 引入 Element Plus 的消息提示组件和类型定义
   */
  import { ElMessage, FormInstance, FormRules } from "element-plus";

  /**
   * 引入 Vue Router，用于获取当前路由信息
   */
  import { useRoute } from "vue-router";

  /**
   * 引入状态管理模块，用于管理用户认证信息
   */
  import { useAuthStore } from "@/stores/auth";

  /**
   * 引入登录 API 和其他工具函数
   */
  import { login } from "@/api/login";
  import { debugLog } from "@/utils/debug";
  import { getRouters } from "@/api/routes";
  import router from "@/router/router";

  /**
   * 引入表单验证规则
   */
  import { passwordRule, userNameRule } from "@/utils/formRegularExpression";

  /**
   * 当前路由实例
   */
  const route = useRoute();

  /**
   * 表单实例的引用，用于调用表单的验证方法
   */
  const loginFormRef = ref<FormInstance>();

  /**
   * 是否显示加载状态的响应式变量
   */
  const loading = ref(false);

  /**
   * 登录表单的数据模型
   * @property {string} username - 用户名
   * @property {string} password - 密码
   */
  const loginForm = reactive({
    username: "WanKanTang",
    password: "",
  });

  /**
   * 登录表单的验证规则
   * @type {FormRules}
   */
  const rules: FormRules = {
    username: userNameRule,
    password: passwordRule,
  };

  /**
   * 处理登录逻辑
   * @returns {void}
   */
  const handleLogin = () => {
    loginFormRef.value?.validate(async (valid) => {
      if (valid) {
        loading.value = true;
        const res = await login(loginForm); // 调用登录 API
        debugLog("返回的登录结果=>", res); // 打印登录结果

        if (res.code == 200 && res.token) {
          ElMessage.success("登录成功");

          // 登录成功后存储 token
          const authStore = useAuthStore();
          authStore.token = res.token;

          // 获取动态路由并存储
          const routes = (await getRouters()).data;
          debugLog("返回动态路由=>", routes);
          authStore.dynamicRoutes = routes;

          // 根据路由参数进行重定向
          const redirectPath = route.query.redirect;
          if (typeof redirectPath === "string") {
            debugLog("重定向回到=> ", redirectPath);
            router.push(redirectPath);
          } else {
            router.push({ name: "Layout" });
          }
        } else {
          ElMessage.error(res.msg); // 登录失败提示
        }

        loading.value = false;
      }
    });
  };
</script>
