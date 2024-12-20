<template>
  <div>
    <!-- 搜索表单 -->
    <el-form :model="queryParams" class="d-flex align-items-center">
      <el-form-item label="属性分类名称" class="mx-md-2 flex-grow-1">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入属性分类名称"
          clearable />
      </el-form-item>
      <el-form-item class="mx-md-2">
        <el-button
          type="primary"
          @click="
            () => {
              currentPage = 1;
              fetchAttributeCategoryList();
            }
          "
          >搜索</el-button
        >
      </el-form-item>
      <el-form-item class="mx-md-2">
        <el-button type="primary" @click="toAddAttributeCategory"
          >添加属性分类</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 药品属性分类表格 -->
    <el-table
      ref="attributeCategoryTable"
      :data="attributeCategoryList"
      table-layout="auto"
      cell-class-name="text-center"
      header-cell-class-name="text-center"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="30" />
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="name" label="属性分类名称" />
      <el-table-column prop="attributeCount" label="规格数量" />
      <el-table-column prop="paramCount" label="参数数量" />
      <DataTebleColumnTime />
      <el-table-column label="规格/参数">
        <template #default="{ row }">
          <div
            class="d-flex justify-content-around align-items-center"
            v-if="!row.admin">
            <el-button-group>
              <el-button
                :type="row.attributeCount > 0 ? 'primary' : 'warning'"
                @click="handleViewAttribute(row, 0)">
                {{ row.attributeCount > 0 ? "查看规格" : "添加规格" }}
              </el-button>
              <el-button
                :type="row.paramCount > 0 ? 'primary' : 'warning'"
                @click="handleViewAttribute(row, 1)">
                {{ row.paramCount > 0 ? "查看参数" : "添加参数" }}
              </el-button>
            </el-button-group>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <div class="d-flex justify-content-around align-items-center">
            <Icon
              icon="icon-bianji"
              class="cursor-pointer"
              @click="toEditAttributeCategory(row)" />
            <Icon
              icon="icon-shanchu"
              class="cursor-pointer text-danger"
              @click="toDelAttributeCategory(row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <CustomPagination
      v-model:current-page="currentPage"
      :total="total"
      @size-change="fetchAttributeCategoryList"
      @current-change="fetchAttributeCategoryList"
      class="mt-3" />

    <!-- 添加/修改属性分类 -->
    <A_EDialog
      v-model:A_EVisible="A_EVisible"
      :A_ETitle="A_ETitle"
      :submitForm="submitForm">
      <template #headerBtn>
        <span class="ms-2" v-if="!isAdd"
          >ID:{{ A_EFormData && A_EFormData["id"] }}</span
        >
      </template>
      <el-form
        :model="A_EFormData"
        ref="A_EFormRef"
        label-width="auto"
        :rules="rules"
        v-if="A_EFormData">
        <el-form-item label="属性分类名称" prop="name">
          <el-input
            v-model="A_EFormData.name"
            placeholder="请输入属性分类名称"
            clearable />
        </el-form-item>
      </el-form>
    </A_EDialog>
  </div>
</template>

<script lang="ts" setup>
  import {
    addAttributeCategory,
    delAttributeCategories,
    editAttributeCategory,
    getAttributeCategoryList,
  } from "@/api/product/attributeCategory";
  import { usePaginationStore } from "@/stores/pagination";
  import { AttributeCategoryItem } from "@/types/product/attributeCategory";
  import { debugLog } from "@/utils/debug";
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm";
  import { AxiosResponse } from "axios";
  import {
    ElMessage,
    FormInstance,
    FormRules,
    TableInstance,
  } from "element-plus";
  import { cloneDeep } from "lodash";
  import { onMounted, reactive, ref } from "vue";
  import { useRouter } from "vue-router";

  // 搜索参数-------------------------
  const queryParams = reactive<Pick<AttributeCategoryItem, "name">>({
    name: "",
  });
  const currentPage = ref(1);
  const paginationStore = usePaginationStore();
  const total = ref(0);
  const attributeCategoryList = ref<AttributeCategoryItem[]>([]);

  // 获取药品属性分类列表--------------------
  const fetchAttributeCategoryList = async () => {
    const res = await getAttributeCategoryList({
      pageNum: currentPage.value,
      pageSize: paginationStore.pageSize,
      ...queryParams,
    });
    debugLog("药品属性分类列表=>", res);
    if (res.code === 200) {
      if (res.rows) attributeCategoryList.value = res.rows;
      if (res.total) total.value = res.total;
    } else ElMessage.error(res.msg || "获取药品属性分类列表失败");
  };
  onMounted(fetchAttributeCategoryList);

  // 添加/修改表单相关逻辑-----------------------
  const isAdd = ref(true);
  const A_EVisible = ref(false);
  const A_ETitle = ref("");
  const defaultForm: AttributeCategoryItem = {
    name: "",
  };

  let A_EFormData: AttributeCategoryItem;
  let A_EFun: (data: AttributeCategoryItem) => Promise<AxiosResponse>;

  const rules: FormRules = {
    name: [
      { required: true, message: "请输入属性分类名称", trigger: "blur" },
      { min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
    ],
  };

  // 提交表单----------------------
  const A_EFormRef = ref<FormInstance>();
  const submitForm = async () => {
    A_EFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        const res = await A_EFun(A_EFormData);
        debugLog(`${A_ETitle.value}结果=>`, res);
        if (res.code === 200) {
          ElMessage.success(`${A_ETitle.value}成功`);
          A_EVisible.value = false;
          // 刷新列表
          fetchAttributeCategoryList();
        } else ElMessage.error(res.msg || `${A_ETitle.value}失败`);
      }
    });
  };

  // 添加属性分类------------------------
  const toAddAttributeCategory = () => {
    A_ETitle.value = "添加属性分类";
    isAdd.value = true;
    A_EFun = addAttributeCategory; // 需要您提供对应的API函数
    A_EFormData = reactive(cloneDeep(defaultForm));
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
  };

  // 修改属性分类-------------------
  const toEditAttributeCategory = (data: AttributeCategoryItem) => {
    A_ETitle.value = "修改属性分类";
    isAdd.value = false;
    A_EFun = editAttributeCategory; // 需要您提供对应的API函数

    // 只提取需要的属性
    A_EFormData = reactive({
      id: data.id,
      name: data.name,
    });
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
  };

  // 删除属性分类--------------
  const selectedAttributes = ref<AttributeCategoryItem[]>([]);
  const attributeCategoryTable = ref<TableInstance>();

  // 选择变化时的处理函数
  const handleSelectionChange = (selection: AttributeCategoryItem[]) => {
    selectedAttributes.value = selection;
  };

  // 删除操作
  const toDelAttributeCategory = (row: AttributeCategoryItem) => {
    // 勾选被点击的行
    attributeCategoryTable.value?.toggleRowSelection(row, true);

    elMessageBoxConfirm(
      `删除以下${
        selectedAttributes.value.length
      }个属性分类: ${selectedAttributes.value.map((attr) => attr.id)}`,
      async () => {
        const attributeCategoryIds = selectedAttributes.value
          .map((attr) => attr.id)
          .filter((id) => id !== undefined);

        const res = await delAttributeCategories(attributeCategoryIds);
        debugLog("删除属性分类结果=>", res);
        if (res.code === 200) {
          ElMessage.success("删除成功");
          // 清空选中
          selectedAttributes.value = [];
          // 重新获取列表数据
          fetchAttributeCategoryList();
        } else ElMessage.error(res.msg || "删除失败");
      }
    );
  };

  // 跳转查看具体的规格/参数
  const router = useRouter();
  const handleViewAttribute = (row: AttributeCategoryItem, type: 0 | 1) => {
    router.push({
      name: "Attribute",
      query: {
        cid: row.id,
        type,
        father: row.name,
      },
    });
  };
</script>
