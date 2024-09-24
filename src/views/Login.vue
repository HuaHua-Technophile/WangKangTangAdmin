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
            v-model="loginForm.username"
            placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleLogin"
            :loading="loading"
            style="width: 100%"
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
  import { useRouter } from "vue-router";
  import { useAuthStore } from "@/stores/auth";
  import axios from "axios";

  const router = useRouter();
  const authStore = useAuthStore();

  const loginFormRef = ref<FormInstance>();
  const loading = ref(false);

  const loginForm = reactive({
    username: "",
    password: "",
  });

  const rules = {
    username: [
      { required: true, message: "请输入用户名", trigger: "blur" },
      {
        min: 3,
        max: 20,
        message: "用户名长度应在 3 到 20 个字符之间",
        trigger: "blur",
      },
    ],
    password: [
      { required: true, message: "请输入密码", trigger: "blur" },
      {
        min: 6,
        max: 20,
        message: "密码长度应在 6 到 20 个字符之间",
        trigger: "blur",
      },
    ],
  };

  const handleLogin = async () => {
    if (!loginFormRef.value) return;

    await loginFormRef.value.validate(async (valid, fields) => {
      if (valid) {
        loading.value = true;
        try {
          const response = await axios.post("http://117.72.77.4:12759/login", {
            username: loginForm.username,
            password: loginForm.password,
          });

          if (response.data.code === 200) {
            authStore.setToken(response.data.data.token);
            ElMessage.success("登录成功");
            router.push("/"); // 登录成功后跳转到首页
          } else {
            ElMessage.error(response.data.msg || "登录失败");
          }
        } catch (error) {
          console.error("登录错误", error);
          ElMessage.error("登录失败，请稍后重试");
        } finally {
          loading.value = false;
        }
      } else {
        console.log("验证失败", fields);
      }
    });
  };
</script>

<style lang="scss" scoped></style>
