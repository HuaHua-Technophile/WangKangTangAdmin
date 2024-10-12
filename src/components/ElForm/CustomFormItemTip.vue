<template>
  <el-form-item :prop="prop" :label="label">
    <template #label v-if="tip">
      <el-tooltip effect="light" :content="tip">
        <Icon icon="icon-wenhao" class="me-1 opacity-50" />
      </el-tooltip>
      {{ label }}
    </template>
    <slot />
  </el-form-item>
</template>

<script setup lang="ts">
  import { defineProps } from "vue";

  const { prop, tip, label } = defineProps<{
    prop: string;
    label: string;
    tip?: string;
  }>();
</script>
