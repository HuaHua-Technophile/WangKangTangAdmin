<template>
  <div
    class="vh-100 vw-100 d-flex align-items-center justify-content-center text-center p-5">
    <div>
      <h1
        class="fw-bold text-danger animate__animated animate__bounce animate__slow animate__infinite"
        style="font-size: 8rem">
        404
      </h1>
      <div class="my-4">
        <h2 class="text-body-secondary" style="font-size: 2rem">
          抱歉，页面未找到
        </h2>
        <p class="fs-5 text-body-tertiary">
          您访问的页面可能已被移除或暂时不可用
        </p>
      </div>
      <el-button size="large" type="primary" @click="router.push('/')"
        >返回首页
      </el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import "animate.css";
  import { useRouter } from "vue-router";
  const router = useRouter();
</script>
