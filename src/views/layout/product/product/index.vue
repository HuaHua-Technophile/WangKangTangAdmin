<template>
  <div>
    <!-- 搜索表单 -->
    <el-form
      :model="queryParams"
      class="flex-grow-1 d-flex justify-content-between align-items-center">
      <el-form-item label="药品名称" class="mx-md-2 flex-grow-1">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入药品名称"
          clearable />
      </el-form-item>
      <el-form-item label="分类" class="mx-md-2">
        <el-select
          v-model="queryParams.categoryId"
          placeholder="请选择分类"
          clearable
          style="width: 150px">
          <el-option
            v-for="item in categoryOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="推荐状态" class="mx-md-2">
        <el-select
          v-model="queryParams.recommendStatus"
          placeholder="全选"
          clearable
          style="width: 120px">
          <el-option :label="'不推荐'" :value="0" />
          <el-option :label="'推荐'" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="处方药" class="mx-md-2">
        <el-select
          v-model="queryParams.isPrescription"
          placeholder="全选"
          clearable
          style="width: 120px">
          <el-option :label="'非处方药'" :value="0" />
          <el-option :label="'处方药'" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item class="mx-md-2">
        <el-button type="primary" @click="fetchProductList">搜索</el-button>
      </el-form-item>
      <el-form-item class="mx-md-2">
        <el-button type="primary" @click="">添加药品</el-button>
      </el-form-item>
    </el-form>

    <!-- 数据展示 -->
    <el-table
      ref="productTable"
      :data="productList"
      table-layout="auto"
      cell-class-name="text-center"
      header-cell-class-name="text-center"
      @selection-change="">
      <el-table-column type="selection" width="30" />
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="name" label="药品名称" />
      <el-table-column label="药品图片">
        <template #default="{ row }">
          <el-image
            :src="row.imageUrl"
            :preview-src-list="[row.imageUrl]"
            fit="cover"
            style="width: 50px; height: 50px" />
        </template>
      </el-table-column>
      <el-table-column prop="freightTemplateId" label="运费(元)" />
      <el-table-column prop="categoryId" label="分类ID" />
      <el-table-column prop="sale" label="销量" />
      <el-table-column prop="recommendStatus" label="推荐状态">
        <template #default="{ row }">
          <el-tag :type="row.recommendStatus === 1 ? 'success' : 'info'">
            {{ row.recommendStatus === 1 ? "已推荐" : "未推荐" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isPrescription" label="处方药">
        <template #default="{ row }">
          <el-tag :type="row.isPrescription === 1 ? 'warning' : 'success'">
            {{ row.isPrescription === 1 ? "是" : "否" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" show-overflow-tooltip />
      <el-table-column label="操作">
        <template #default="{ row }">
          <div class="d-flex justify-content-around align-items-center">
            <Icon icon="icon-bianji" class="cursor-pointer" @click="" />
            <Icon
              icon="icon-shuoming"
              class="cursor-pointer text-primary"
              @click="" />
            <Icon
              icon="icon-shanchu"
              class="cursor-pointer text-danger"
              @click="" />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts" setup>
  // import { getCategoryList } from "@/api/product/category";
  import { getProductList } from "@/api/product/product";
  import { usePaginationStore } from "@/stores/pagination";
  import { ProductItem } from "@/types/product/product";
  import { debugLog } from "@/utils/debug";
  import { ElMessage } from "element-plus";
  import { onMounted, reactive, ref, watch } from "vue";

  // 查询参数使用 Pick 从 ProductItem 接口中选择需要的字段
  const queryParams = reactive<
    Pick<
      ProductItem,
      "name" | "categoryId" | "recommendStatus" | "isPrescription"
    >
  >({
    name: "",
    categoryId: undefined,
    recommendStatus: undefined,
    isPrescription: undefined,
  });

  // 分页相关响应式数据
  const currentPage = ref(1);
  const paginationStore = usePaginationStore();
  const total = ref(0);

  // 药品列表数据
  const productList = ref<ProductItem[]>([]);

  // 获取药品列表
  const fetchProductList = async () => {
    const res = await getProductList({
      pageNum: currentPage.value,
      pageSize: paginationStore.pageSize,
      ...queryParams,
    });
    debugLog("药品列表=>", res);

    if (res.code === 200) {
      if (res.rows) productList.value = res.rows;
      if (res.total) total.value = res.total;
    } else ElMessage.error(res.msg || "获取药品列表失败");
  };

  // 监听页码变化
  watch(currentPage, () => {
    fetchProductList();
  });

  // 获取分类选项数据
  const categoryOptions = ref<{ id: number; name: string }[]>([]);
  const fetchCategoryOptions = async () => {
    /* const res = await getCategoryList();
    if (res.code === 200) {
      categoryOptions.value = res.data || [];
    } else ElMessage.error(res.msg || "获取分类列表失败"); */
  };

  // 组件挂载时获取数据
  onMounted(() => {
    fetchProductList();
    fetchCategoryOptions();
  });
</script>
