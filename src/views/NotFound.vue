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
  /**
   * 404页面组件的业务逻辑
   * @module NotFound
   */

  import "animate.css";
  import { useRouter } from "vue-router";

  /**
   * Vue Router实例，用于页面导航
   * @constant {import('vue-router').Router}
   */
  const router = useRouter();
</script>

<!--
以下是组件的样式依赖说明：
1. Bootstrap 5 提供的工具类:
   - vh-100, vw-100: 设置容器高度和宽度为100%视口
   - d-flex, align-items-center, justify-content-center: Flexbox布局
   - text-center: 文本居中
   - p-5: 内边距
   - my-4: 垂直外边距
   - fs-5: 字体大小
   - text-body-secondary, text-body-tertiary: 文本颜色
   - fw-bold: 字体粗细

2. Animate.css 提供的动画类:
   - animate__animated: 基础动画类
   - animate__bounce: 弹跳动画
   - animate__slow: 减慢动画速度
   - animate__infinite: 无限循环动画

3. Element Plus 组件:
   - el-button: Element Plus的按钮组件
-->
