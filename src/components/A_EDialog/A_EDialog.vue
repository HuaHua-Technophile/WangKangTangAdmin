<template>
  <el-dialog
    v-model="A_EVisible"
    :title="A_ETitle"
    :width="width"
    :before-close="closeConfirmFun"
    class="rounded-4"
    draggable
    center>
    <!-- 具名插槽 -->
    <template #header>
      <el-button @click="submitForm"
        >确认{{ A_ETitle }}<slot name="headerBtn" />
      </el-button>
    </template>
    <!-- 默认插槽 -->
    <slot />
  </el-dialog>
</template>
<script lang="ts" setup>
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm";
  const A_EVisible = defineModel<boolean>("A_EVisible");
  const props = withDefaults(
    defineProps<{
      A_ETitle: string;
      reQueryFun: () => void;
      submitFun: () => Promise<boolean>;
      width?: string;
    }>(),
    {
      width: "485px",
    }
  );

  const closeConfirmFun = (done: () => void) => {
    elMessageBoxConfirm(`放弃${props.A_ETitle}`, () => {
      done();
    });
  };

  const submitForm = async () => {
    const submitSuccess = await props.submitFun();
    if (submitSuccess) {
      A_EVisible.value = false;
      props.reQueryFun();
    }
  };
</script>
