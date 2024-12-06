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
        <!-- <template #default="scope"></template> -->
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
        <span class="ms-2" v-if="!isAdd">ID: {{ A_EForm && A_EForm.id }}</span>
      </template>
      <el-form
        :model="A_EForm"
        ref="A_EFormRef"
        label-width="auto"
        :rules="rules"
        v-if="A_EForm">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="A_EForm.name" placeholder="请输入药品分类名称" />
        </el-form-item>
        <el-form-item label="上级分类" prop="parentId">
          <el-tree-select
            v-model="A_EForm.parentId"
            :data="categoryTreeSelect"
            check-strictly
            placeholder="选择上级分类"
            clearable />
        </el-form-item>
        <el-form-item label="分类排序" prop="sort">
          <el-input-number v-model="A_EForm.sort" :min="0" />
        </el-form-item>
        <el-form-item label="分类示意图" prop="icon" v-if="!isAdd">
          <el-image
            fit="cover"
            style="width: 100px; height: 100px"
            :src="imageUrl"
            :preview-src-list="previewSrcList"
            :preview-teleported="true"
            class="me-3" />
          <CropperUpload
            ref="cropperUploadRef"
            :uploadApi="commonUpload"
            v-model:croppedFile="croppedFile"
            :showUploadBtn="false"
            needThumbnail />
        </el-form-item>
        <el-form-item label="分类状态" prop="status">
          <el-radio-group v-model="A_EForm.status">
            <el-radio :label="'禁用'" :value="0" />
            <el-radio :label="'启用'" :value="1" />
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
  import { commonUpload } from "@/api/upload";
  import { CategoryItem } from "@/types/product/category";
  import { TreeSelectItem } from "@/types/treeSelect";
  import { debugLog } from "@/utils/debug";
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm";
  import { formatTreeSelectByFlat } from "@/utils/formatTreeSelectByFlat";
  import {
    ElMessage,
    FormInstance,
    FormRules,
    TableInstance,
  } from "element-plus";
  import { computed, onMounted, reactive, ref, toRaw, watch } from "vue";

  // 请求参数设置------------
  const queryParams = reactive<Pick<CategoryItem, "name" | "status">>({});
  const categoryTree = ref<CategoryItem[]>();
  const total = ref(0);
  const formatCategoryTreeByFlat = async (
    flat: CategoryItem[]
  ): Promise<CategoryItem[]> => {
    const nodeMap = new Map<number, CategoryItem>();

    // 第一次遍历：创建节点映射
    for (const item of flat) {
      nodeMap.set(item.id!, {
        ...item,
        children: [],
      });
    }

    const result: CategoryItem[] = [];

    // 第二次遍历：构建树形结构
    for (const item of flat) {
      const currentNode = nodeMap.get(item.id!);

      if (currentNode) {
        // 如果当前节点的父ID是1，直接将其作为根节点
        if (item.parentId === 1) {
          result.push(currentNode);
        }
        // 对于其他节点，如果父节点存在且不是ID为1的节点，则添加到对应父节点的children中
        else if (
          item.parentId !== undefined &&
          item.parentId !== 0 &&
          item.parentId !== 1 &&
          nodeMap.has(item.parentId)
        ) {
          const parentNode = nodeMap.get(item.parentId);
          parentNode?.children?.push(currentNode);
        }
        // 如果是真正的根节点（parentId为0或undefined）且不是ID为1的节点
        else if (
          (item.parentId === undefined || item.parentId === 0) &&
          item.id !== 1
        )
          result.push(currentNode);
      }
    }

    return result;
  };
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
      total.value = res.total;
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
  let A_EForm: CategoryItem;
  const categoryTreeSelect = ref<TreeSelectItem[]>([]);

  // 添加/修改方法
  const toAddCategory = async () => {
    A_EVisible.value = true;
    A_ETitle.value = "添加药品分类";
    isAdd.value = true;
    A_EForm = reactive({ ...defaultForm }); // 重置表单

    const res = await getCategoryList({ name: undefined, status: 1 });
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
    A_EVisible.value = true;
    A_ETitle.value = "修改药品分类";
    isAdd.value = false;

    A_EForm = reactive({
      id: row.id,
      name: row.name,
      parentId: row.parentId,
      icon: row.icon,
      sort: row.sort,
      status: row.status,
    }); // 复制当前行数据到表单

    if (A_EForm.icon) previewSrcList.value = [A_EForm.icon]; // 初始化 previewSrcList

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

  // 裁剪图片
  const croppedFile = ref<File>();
  const previewSrcList = ref<string[]>([]);
  const imageUrl = computed(() =>
    croppedFile.value ? URL.createObjectURL(croppedFile.value) : A_EForm.icon
  );
  // 监听 croppedFile 的变化
  watch(croppedFile, (newFile) => {
    if (newFile) {
      const fileUrl = URL.createObjectURL(newFile);
      previewSrcList.value = [fileUrl];
    } else if (A_EForm.icon) previewSrcList.value = [A_EForm.icon];
  });

  // 提交表单
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
          A_EForm.icon = croppedRes.fileName;
          if (thumbnailRes?.code === 200)
            A_EForm.miniImg = thumbnailRes.fileName;
        }

        const apiMethod = isAdd.value ? addCategory : editCategory;
        const res = await apiMethod(A_EForm);
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
