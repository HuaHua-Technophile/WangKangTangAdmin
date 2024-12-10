<template><div></div></template>
<script lang="ts" setup>
  import { useRouteParamsValidation } from "@/utils/router/useRouteParamsValidation";
  useRouteParamsValidation({
    requiredParams: ["cid", "type"],
  });
</script>
