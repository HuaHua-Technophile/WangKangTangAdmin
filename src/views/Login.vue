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
  import { ref, reactive } from "vue";
  import { ElMessage, FormInstance, FormRules } from "element-plus";
  import { useRoute } from "vue-router";
  import { useAuthStore } from "@/stores/auth";
  import { login } from "@/api/login"; // 引入登录 API
  import { debugLog } from "@/utils/debug";
  import { getRouters } from "@/api/routes";
  import router from "@/router/router";
  import { passwordRule, userNameRule } from "@/utils/formRegularExpression";

  const route = useRoute(); // 使用 useRoute 获取当前路由信息
  const loginFormRef = ref<FormInstance>();
  const loading = ref(false);

  const loginForm = reactive({
    username: "admin",
    password: "123456",
  });

  const rules: FormRules = {
    username: userNameRule,
    password: passwordRule,
  };

  const handleLogin = () => {
    loginFormRef.value?.validate(async (valid) => {
      if (valid) {
        loading.value = true;
        const res = await login(loginForm);
        debugLog("返回的登录结果=>", res); // 请求返回结果
        if (res.code == 200 && res.token) {
          ElMessage.success("登录成功");
          // 处理登录成功逻辑，例如存储 token 和跳转页面
          const authStore = useAuthStore();
          authStore.token = res.token;

          const routes = (await getRouters()).data;
          debugLog("返回动态路由=>", routes); // 请求动态路由
          authStore.dynamicRoutes = routes; // 存储动态路由

          const redirectPath = route.query.redirect;
          if (typeof redirectPath === "string") {
            debugLog("重定向回到=> ", redirectPath);
            router.push(redirectPath);
          }
          //确保重定向路径是字符串时，跳转到指定页面
          else router.push({ name: "Layout" }); // 否则默认重定向到Layout整体布局组件
        } else ElMessage.error(res.msg);
        loading.value = false;
      }
    });
  };
</script>

<style lang="scss" scoped></style>
