<template>
  <div>
    <el-select
      v-model="currentType"
      placeholder="请选择类型"
      @change="handleTypeChange">
      <el-option label="规格" value="0" />
      <el-option label="参数" value="1" />
    </el-select>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useRouteParamsValidation } from "@/utils/router/useRouteParamsValidation";

  // 验证路由参数-----------------------------------
  useRouteParamsValidation({
    requiredParams: ["cid", "type"],
  });

  // 顶部类型选单-----------------------------
  const route = useRoute();
  const router = useRouter();
  const currentType = ref<string | undefined>("");
  const handleTypeChange = (value: string) => {
    // 构建新的路由参数
    router.push({
      path: route.path,
      query: {
        ...route.query,
        type: value,
      },
    });
  };
  // 组件挂载时，从路由参数获取type
  onMounted(() => {
    currentType.value = (route.query.type as string) || undefined;
  });
</script>
