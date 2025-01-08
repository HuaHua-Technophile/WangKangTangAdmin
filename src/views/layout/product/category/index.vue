<template>
  <div>
    <!-- 搜索表单 -->
    <el-form
      :model="queryParams"
      class="flex-grow-1 d-flex justify-content-between align-items-center">
      <el-form-item label="分类名称" class="mx-md-2 flex-grow-1">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入分类名称"
          clearable />
      </el-form-item>
      <el-form-item label="状态" class="mx-md-2">
        <el-select
          v-model="queryParams.status"
          placeholder="全选"
          clearable
          style="width: 100px">
          <el-option :label="'禁用'" :value="'0'" />
          <el-option :label="'启用'" :value="'1'" />
        </el-select>
      </el-form-item>
      <el-form-item class="mx-md-2">
        <el-button type="primary" @click="fetchCategoryList">搜索</el-button>
      </el-form-item>
      <el-form-item class="mx-md-2">
        <el-button type="primary" @click="toAddCategory">添加分类</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据展示表格 -->
    <el-table
      ref="categoryTable"
      :data="categoryTree"
      table-layout="auto"
      cell-class-name="text-center"
      header-cell-class-name="text-center"
      row-key="id"
      :tree-props="{ checkStrictly: true }"
      @selection-change="handleCategorySelectionChange"
      class="w-100">
      <!-- 添加多选列 -->
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="name" label="分类名称" />
      <el-table-column prop="sort" label="排序" />
      <el-table-column label="子级数量">
        <template #default="scope">
          <span>{{ scope.row.children.length }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="示意图">
        <template #default="scope">
          <el-image
            v-if="scope.row.icon != '#' && scope.row.icon != ''"
            :src="BASEURL + scope.row.miniImg"
            :preview-src-list="[BASEURL + scope.row.icon]"
            :preview-teleported="true"
            style="width: 60px; height: 60px" />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? 'primary' : 'danger'">
            {{ scope.row.status === 1 ? "启用" : "禁用" }}
          </el-tag>
        </template>
      </el-table-column>
      <DataTebleColumnTime />
      <el-table-column label="操作">
        <template #default="{ row }">
          <div
            class="d-flex justify-content-around align-items-center"
            v-if="!row.admin">
            <Icon
              icon="icon-bianji"
              class="cursor-pointer"
              @click="toEditCategory(row)" />
            <Icon
              icon="icon-shanchu"
              class="cursor-pointer text-danger"
              @click="toDelCategorie(row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加/修改弹窗 -->
    <A_EDialog
      v-model:A_EVisible="A_EVisible"
      :A_ETitle="A_ETitle"
      :submitForm="submitForm">
      <template #headerBtn>
        <span class="ms-2" v-if="!isAdd"
          >ID: {{ A_EFormData && A_EFormData.id }}</span
        >
      </template>
      <el-form
        :model="A_EFormData"
        ref="A_EFormRef"
        label-width="auto"
        :rules="rules"
        v-if="A_EFormData">
        <el-form-item label="分类名称" prop="name">
          <el-input
            v-model="A_EFormData.name"
            placeholder="请输入药品分类名称" />
        </el-form-item>
        <el-form-item label="上级分类" prop="parentId">
          <el-tree-select
            v-model="A_EFormData.parentId"
            :data="categoryTreeSelect"
            check-strictly
            placeholder="选择上级分类"
            clearable />
        </el-form-item>
        <el-form-item label="分类排序" prop="sort">
          <el-input-number v-model="A_EFormData.sort" :min="0" />
        </el-form-item>
        <el-form-item label="分类示意图" prop="icon" v-if="!isAdd">
          <el-image
            fit="cover"
            style="width: 100px; height: 100px"
            :src="A_EImgUrl"
            :preview-src-list="A_EImgPreviewSrcList"
            :preview-teleported="true"
            class="me-3" />
          <CropperUpload
            ref="cropperUploadRef"
            :uploadApi="allFileUpload"
            v-model:croppedFile="croppedFile"
            :showUploadBtn="false"
            :showClearBtn="showClearBtn"
            @clear="clearImg"
            needThumbnail />
        </el-form-item>
        <el-form-item label="分类状态" prop="status">
          <el-radio-group v-model="A_EFormData.status">
            <el-radio-button :label="'禁用'" :value="0" />
            <el-radio-button :label="'启用'" :value="1" />
          </el-radio-group>
        </el-form-item>
      </el-form>
    </A_EDialog>
  </div>
</template>
<script lang="ts" setup>
  import {
    addCategory,
    delCategories,
    editCategory,
    getCategoryList,
    getCategoryListExclude,
  } from "@/api/product/category";
  import { allFileUpload } from "@/api/upload";
  import { CategoryItem } from "@/types/product/category";
  import { TreeSelectItem } from "@/types/treeSelect";
  import { debugLog } from "@/utils/debug";
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm";
  import { formatTreeSelectByFlat } from "@/utils/formatTreeSelectByFlat";
  import { formatCategoryTreeByFlat } from "@/utils/product/category/format";
  import {
    ElMessage,
    FormInstance,
    FormRules,
    TableInstance,
  } from "element-plus";
  import { cloneDeep } from "lodash";
  import { computed, onMounted, reactive, ref, toRaw } from "vue";

  const BASEURL = import.meta.env.VITE_APP_API_BASE_URL;

  // 请求参数设置------------
  const queryParams = reactive<Pick<CategoryItem, "name" | "status">>({});
  const categoryTree = ref<CategoryItem[]>();
  const fetchCategoryList = async () => {
    const res = await getCategoryList({
      pageNum: 1,
      pageSize: 999999,
      ...queryParams,
    });
    debugLog("获取到药品分类列表=>", res);
    if (res.rows && res.total !== undefined) {
      categoryTree.value = await formatCategoryTreeByFlat(res.rows);
      debugLog("处理后的药品分类=>", toRaw(categoryTree.value));
    } else ElMessage.error(res.msg || "获取药品分类列表失败");
  };
  onMounted(fetchCategoryList);

  // 添加/修改弹窗------------------------
  const A_EVisible = ref(false);
  const A_ETitle = ref("");
  const isAdd = ref(true);
  // 默认表单---------------------
  const defaultForm: CategoryItem = {
    name: "",
    status: 1,
    sort: 0,
  };
  const rules: FormRules = {
    name: [
      { required: true, message: "请输入分类名称", trigger: "blur" },
      { min: 2, max: 20, message: "长度在2-20个字符", trigger: "blur" },
    ],
    parentId: [
      { required: true, message: "请选择上级分类", trigger: "change" },
    ],
    status: [{ required: true, message: "请选择分类状态", trigger: "change" }],
  };
  const A_EFormData = reactive<CategoryItem>(cloneDeep(defaultForm));
  const categoryTreeSelect = ref<TreeSelectItem[]>([]);
  const showClearBtn = computed(() => {
    return (
      A_EFormData.icon !== undefined &&
      A_EFormData.icon !== "#" &&
      A_EFormData.icon !== ""
    );
  });
  // 添加/修改方法
  const toAddCategory = async () => {
    A_ETitle.value = "添加药品分类";
    isAdd.value = true;
    Object.assign(A_EFormData, defaultForm); // 重置表单
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();

    const res = await getCategoryList({
      pageNum: 1,
      pageSize: 99999,
      status: 1,
    });
    debugLog("全部药品分类列表=>", res);
    if (res.code == 200 && res.rows)
      categoryTreeSelect.value = await formatTreeSelectByFlat({
        flat: res.rows,
        rootLabel: "顶级分类",
        rootValue: 1,
        rootId: 1,
      });
    debugLog("处理后的药品分类树形选单=>", categoryTreeSelect.value);
  };
  const toEditCategory = async (row: CategoryItem) => {
    A_ETitle.value = "修改药品分类";
    isAdd.value = false;
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
    Object.assign(A_EFormData, row); // 复制当前行数据到表单

    // 获取分类树形数据
    const res = await getCategoryListExclude(row.id!);
    debugLog(`排除ID: ${row.id} 后的药品分类列表=>`, res);
    if (res.code == 200 && res.data)
      categoryTreeSelect.value = await formatTreeSelectByFlat({
        flat: res.data,
        rootLabel: "顶级分类",
        rootValue: 1,
        rootId: 1,
      });
    debugLog("处理后的药品分类树形选单=>", categoryTreeSelect.value);
  };

  const clearImg = () => {
    debugLog("清除了当前分类的所选图片");
    A_EFormData.icon = "";
    A_EFormData.miniImg = "";
  };

  // 裁剪图片-------------------------
  const croppedFile = ref<File>();
  const A_EImgUrl = computed(() =>
    croppedFile.value
      ? URL.createObjectURL(croppedFile.value)
      : BASEURL + A_EFormData.miniImg
  );
  const A_EImgPreviewSrcList = computed(() =>
    croppedFile.value
      ? [URL.createObjectURL(croppedFile.value)]
      : [BASEURL + A_EFormData.icon]
  );

  // 提交表单---------------------
  const A_EFormRef = ref<FormInstance>();
  const cropperUploadRef = ref();
  const submitForm = () => {
    A_EFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        // 如果有裁剪的图片，先上传图片
        if (croppedFile.value) {
          const { croppedRes, thumbnailRes } =
            await cropperUploadRef.value.handleUpload();

          if (!croppedRes || croppedRes.code !== 200) {
            ElMessage.error("图片上传失败");
            return;
          }

          // 更新表单数据中的图片URL
          A_EFormData.icon = croppedRes.fileName;
          if (thumbnailRes?.code === 200)
            A_EFormData.miniImg = thumbnailRes.fileName;
        }

        const apiMethod = isAdd.value ? addCategory : editCategory;
        const res = await apiMethod(A_EFormData);
        debugLog(`${A_ETitle.value}结果=>`, res);

        if (res.code === 200) {
          A_EVisible.value = false;
          ElMessage.success(`${A_ETitle.value}成功`);
          fetchCategoryList(); // 刷新列表
        } else ElMessage.error(res.msg || `${A_ETitle.value}失败`);
      }
    });
  };

  // 药品分类表格和选中项
  const selectedCategories = ref<CategoryItem[]>([]);
  const categoryTable = ref<TableInstance>();

  // 多选变化处理
  const handleCategorySelectionChange = (selection: CategoryItem[]) => {
    selectedCategories.value = selection;
  };

  // 删除单个药品分类
  const toDelCategorie = (row: CategoryItem) => {
    // 勾选被点击的行
    categoryTable.value?.toggleRowSelection(row, true);

    elMessageBoxConfirm(
      `删除以下${
        selectedCategories.value.length
      }个药品分类 ID: ${selectedCategories.value.map((i) => i.id)}`,
      async () => {
        const categoryIds = selectedCategories.value
          .map((i) => i.id)
          .filter((id) => id !== undefined);

        const res = await delCategories(categoryIds);
        debugLog("删除药品分类=>", res);

        if (res.code === 200) {
          ElMessage.success("删除成功");
          selectedCategories.value = [];
          fetchCategoryList(); // 重新获取分类列表
        } else ElMessage.error(res.msg || "删除失败");
      }
    );
  };
</script>
