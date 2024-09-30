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
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model.trim="loginForm.username"
            maxlength="12"
            clearable
            @keyup.enter="handleLogin"
            placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model.trim="loginForm.password"
            maxlength="20"
            clearable
            @keyup.enter="handleLogin"
            type="password"
            show-password
            placeholder="请输入密码"></el-input>
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
  import { ElMessage, FormInstance } from "element-plus";
  import { useRoute } from "vue-router";
  import { useAuthStore } from "@/stores/auth";
  import { login } from "@/api/login"; // 引入登录 API
  import { debugError, debugLog } from "@/utils/debug";
  import { getRouters } from "@/api/routes";
  import router from "@/router/router";
  import { passwordRule } from "@/utils/passwordRules";

  const route = useRoute(); // 使用 useRoute 获取当前路由信息
  const loginFormRef = ref<FormInstance>();
  const loading = ref(false);

  const loginForm = reactive({
    username: "admin",
    password: "admin123",
  });

  const rules = {
    username: [
      { required: true, message: "请输入用户名", trigger: "blur" },
      { min: 3, max: 12, message: "长度在3~12个字符", trigger: "blur" },
    ],
    password: passwordRule,
  };

  const handleLogin = async () => {
    if (!loginFormRef.value) return;

    await loginFormRef.value.validate(async (valid) => {
      if (valid) {
        loading.value = true;
        try {
          const response = await login(loginForm);
          console.log("登录成功", response);
          if (response.token) {
            ElMessage.success("登录成功");
            // 处理登录成功逻辑，例如存储 token 和跳转页面
            const authStore = useAuthStore();
            authStore.token = response.token;

            const routes = (await getRouters()).data;
            debugLog("返回动态路由=>", routes); // 请求动态路由
            authStore.dynamicRoutes = routes; // 存储动态路由

            const redirectPath = route.query.redirect;
            if (typeof redirectPath === "string") {
              debugLog("登陆完毕，重定向回=>", redirectPath);
              router.push(redirectPath);
            }
            //确保重定向路径是字符串时，跳转到指定页面
            else router.push({ name: "Layout" }); // 否则默认重定向到Layout整体布局组件
          } else ElMessage.error("登录失败，未返回数据");
        } catch (error) {
          debugError("登陆环节", error);
        } finally {
          loading.value = false;
        }
      } else debugLog("表单验证失败");
    });
  };
</script>

<style lang="scss" scoped></style>
