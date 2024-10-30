<template>
  <div></div>
</template>
<script lang="ts" setup>
  import { getCategoryList } from "@/api/product/category";
  import { usePaginationStore } from "@/stores/pagination";
  import { CategoryItem } from "@/types/product/category";
  import { debugLog } from "@/utils/debug";
  import { ElMessage } from "element-plus";
  import { onMounted, reactive, ref } from "vue";

  // 请求参数设置------------
  const queryParams = reactive<Pick<CategoryItem, "name" | "status">>({});
  const categoryList = ref<CategoryItem[]>();
  const total = ref(0);
  const paginationStore = usePaginationStore();
  const currentPage = ref(1);
  const fetChcategoryList = async () => {
    const res = await getCategoryList({
      pageNum: currentPage.value,
      pageSize: paginationStore.pageSize,
      ...queryParams,
    });
    debugLog("参数设置列表=>", res);
    if (res.rows && res.total !== undefined) {
      categoryList.value = res.rows;
      total.value = res.total;
    } else ElMessage.error(res.msg || "获取参数设置列表失败");
  };
  onMounted(fetChcategoryList);
</script>
