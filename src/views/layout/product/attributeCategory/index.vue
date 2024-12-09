<template>
  <div>
    <!-- 搜索表单 -->
    <el-form :model="queryParams" class="d-flex align-items-center mb-3">
      <el-form-item label="属性分类名称" class="flex-grow-1">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入属性名称"
          clearable />
      </el-form-item>
      <el-form-item class="mb-0">
        <el-button type="primary" @click="fetchList">搜索</el-button>
        <el-button type="primary" @click="toAdd">新增属性</el-button>
      </el-form-item>
    </el-form>

    <!-- 数据表格 -->
    <el-table
      ref="tableRef"
      :data="tableData"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="分类名称" />
      <el-table-column prop="attributeCount" label="属性数量" />
      <el-table-column prop="paramCount" label="参数数量" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" link @click="toEdit(row)"> 编辑 </el-button>
          <el-button type="danger" link @click="toDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="queryParams.pageNum"
      v-model:page-size="queryParams.pageSize"
      :total="total"
      @current-change="fetchList"
      @size-change="fetchList"
      class="mt-3" />

    <!-- 添加/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑分类' : '新增分类'"
      width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from "vue";
  import type { FormInstance, FormRules } from "element-plus";
  import { ElMessage, ElMessageBox } from "element-plus";
  import {
    getAttributeCategoryList,
    addAttributeCategory,
    editAttributeCategory,
    delAttributeCategories,
  } from "@/api/product/attributeCategory";
  import type { AttributeCategoryItem } from "@/types/product/attributeCategory";

  // 查询参数
  const queryParams = reactive({
    pageNum: 1,
    pageSize: 10,
    name: "",
  });

  // 表格数据
  const tableData = ref<AttributeCategoryItem[]>([]);
  const total = ref(0);
  const selectedRows = ref<AttributeCategoryItem[]>([]);

  // 获取列表数据
  const fetchList = async () => {
    try {
      const res = await getAttributeCategoryList(queryParams);
      if (res.code === 200) {
        tableData.value = res.data;
        total.value = res.total || 0;
      }
    } catch (error) {
      console.error("获取列表失败:", error);
    }
  };

  // 表单相关
  const dialogVisible = ref(false);
  const isEdit = ref(false);
  const formRef = ref<FormInstance>();
  const form = reactive<Partial<AttributeCategoryItem>>({
    name: "",
  });

  const rules: FormRules = {
    name: [
      { required: true, message: "请输入分类名称", trigger: "blur" },
      { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
    ],
  };

  // 新增
  const toAdd = () => {
    isEdit.value = false;
    form.name = "";
    dialogVisible.value = true;
  };

  // 编辑
  const toEdit = (row: AttributeCategoryItem) => {
    isEdit.value = true;
    Object.assign(form, row);
    dialogVisible.value = true;
  };

  // 提交表单
  const submitForm = async () => {
    if (!formRef.value) return;

    await formRef.value.validate(async (valid) => {
      if (valid) {
        try {
          const apiMethod = isEdit.value
            ? editAttributeCategory
            : addAttributeCategory;
          const res = await apiMethod(form as AttributeCategoryItem);

          if (res.code === 200) {
            ElMessage.success(`${isEdit.value ? "编辑" : "新增"}成功`);
            dialogVisible.value = false;
            fetchList();
          }
        } catch (error) {
          console.error("提交失败:", error);
        }
      }
    });
  };

  // 删除
  const toDelete = async (row: AttributeCategoryItem) => {
    try {
      await ElMessageBox.confirm("确认删除该分类吗？");
      const res = await delAttributeCategories([row.id]);
      if (res.code === 200) {
        ElMessage.success("删除成功");
        fetchList();
      }
    } catch (error) {
      console.error("删除失败:", error);
    }
  };

  // 表格多选
  const handleSelectionChange = (selection: AttributeCategoryItem[]) => {
    selectedRows.value = selection;
  };

  // 初始化
  fetchList();
</script>
