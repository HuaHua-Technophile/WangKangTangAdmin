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
      @size-change="refreshList"
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

  /**
   * @description 搜索查询参数
   * @type {Pick<AttributeCategoryItem, "name">}
   */
  const queryParams = reactive<Pick<AttributeCategoryItem, "name">>({
    name: "",
  });

  /**
   * @description 当前页码
   */
  const currentPage = ref(1);

  /**
   * @description 分页存储实例
   */
  const paginationStore = usePaginationStore();

  /**
   * @description 总记录数
   */
  const total = ref(0);

  /**
   * @description 属性分类列表数据
   */
  const attributeCategoryList = ref<AttributeCategoryItem[]>([]);

  /**
   * @description 获取药品属性分类列表
   * @async
   */
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

  /**
   * @description 刷新列表数据
   */
  const refreshList = () => {
    currentPage.value = 1;
    fetchAttributeCategoryList();
  };

  onMounted(fetchAttributeCategoryList);

  /**
   * @description 添加/修改表单相关状态
   */
  const isAdd = ref(true);
  const A_EVisible = ref(false);
  const A_ETitle = ref("");

  /**
   * @description 默认表单数据
   */
  const defaultForm: AttributeCategoryItem = {
    name: "",
  };

  let A_EFormData: AttributeCategoryItem;
  let A_EFun: (data: AttributeCategoryItem) => Promise<AxiosResponse>;

  /**
   * @description 表单验证规则
   */
  const rules: FormRules = {
    name: [
      { required: true, message: "请输入属性分类名称", trigger: "blur" },
      { min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
    ],
  };

  /**
   * @description 表单引用
   */
  const A_EFormRef = ref<FormInstance>();

  /**
   * @description 提交表单
   * @async
   */
  const submitForm = async () => {
    A_EFormRef.value?.validate(async (valid: boolean) => {
      if (!valid) return;
      const res = await A_EFun(A_EFormData);
      debugLog(`${A_ETitle.value}结果=>`, res);
      if (res.code === 200) {
        ElMessage.success(`${A_ETitle.value}成功`);
        A_EVisible.value = false;
        fetchAttributeCategoryList();
      } else ElMessage.error(res.msg || `${A_ETitle.value}失败`);
    });
  };

  /**
   * @description 打开添加属性分类对话框
   */
  const toAddAttributeCategory = () => {
    A_ETitle.value = "添加属性分类";
    isAdd.value = true;
    A_EFun = addAttributeCategory;
    A_EFormData = reactive(cloneDeep(defaultForm));
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
  };

  /**
   * @description 打开修改属性分类对话框
   * @param {AttributeCategoryItem} data - 要修改的属性分类数据
   */
  const toEditAttributeCategory = (data: AttributeCategoryItem) => {
    A_ETitle.value = "修改属性分类";
    isAdd.value = false;
    A_EFun = editAttributeCategory;
    A_EFormData = reactive({
      id: data.id,
      name: data.name,
    });
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
  };

  /**
   * @description 选中的属性列表
   */
  const selectedAttributes = ref<AttributeCategoryItem[]>([]);
  const attributeCategoryTable = ref<TableInstance>();

  /**
   * @description 表格选择变化处理函数
   * @param {AttributeCategoryItem[]} selection - 选中的行数据
   */
  const handleSelectionChange = (selection: AttributeCategoryItem[]) => {
    selectedAttributes.value = selection;
  };

  /**
   * @description 删除属性分类
   * @param {AttributeCategoryItem} row - 要删除的属性分类行数据
   */
  const toDelAttributeCategory = (row: AttributeCategoryItem) => {
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
          selectedAttributes.value = [];
          fetchAttributeCategoryList();
        } else ElMessage.error(res.msg || "删除失败");
      }
    );
  };

  const router = useRouter();

  /**
   * @description 跳转到规格/参数详情页
   * @param {AttributeCategoryItem} row - 当前行数据
   * @param {0 | 1} type - 跳转类型：0-规格，1-参数
   */
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
