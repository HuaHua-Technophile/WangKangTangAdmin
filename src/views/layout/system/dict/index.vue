<template>
  <div>
    <!-- 搜索区域 -->
    <el-form :model="queryForm" class="d-flex align-items-center">
      <el-form-item label="字典名称" class="mx-md-2 flex-grow-1">
        <el-input
          v-model="queryForm.dictName"
          placeholder="请输入字典名称"
          clearable />
      </el-form-item>
      <el-form-item label="字典类型" class="mx-md-2 flex-grow-1">
        <el-input
          v-model="queryForm.dictType"
          placeholder="请输入字典类型"
          clearable />
      </el-form-item>
      <el-form-item label="状态" class="mx-md-2">
        <el-radio-group v-model="queryForm.status">
          <el-radio :value="''">全部</el-radio>
          <el-radio :value="'0'">正常</el-radio>
          <el-radio :value="'1'">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="mx-md-2">
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
      <el-form-item class="mx-md-2">
        <el-button type="primary" @click="toAddDictType">添加字典</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      ref="dictTable"
      :data="dictTypeList"
      table-layout="auto"
      cell-class-name="text-center"
      header-cell-class-name="text-center"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="30" />
      <el-table-column prop="dictName" label="字典名称" />
      <el-table-column prop="dictType" label="字典类型" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === '0' ? 'primary' : 'danger'">
            {{ row.status === "0" ? "正常" : "停用" }}
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
              @click="toEditDictType(row)" />
            <Icon
              icon="icon-shanchu"
              class="cursor-pointer text-danger"
              @click="toDelDictType(row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <CustomPagination
      v-model:current-page="currentPage"
      :total="total"
      @size-change="fetchDictTypeList"
      @current-change="fetchDictTypeList"
      class="mt-3" />
    <!-- 新增/编辑对话框 -->
    <A_EDialog
      v-model:A_EVisible="A_EVisible"
      :A_ETitle="A_ETitle"
      :submitForm="handleSubmit">
      <template #headerBtn>
        <span class="ms-2" v-if="A_EForm.dictId"
          >ID:{{ A_EForm && A_EForm["dictId"] }}</span
        >
      </template>
      <el-form
        :model="A_EForm"
        label-width="auto"
        :rules="rules"
        ref="A_EFormRef">
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="A_EForm.dictName" clearable />
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="A_EForm.dictType" clearable />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="A_EForm.status">
            <el-radio :value="'0'">正常</el-radio>
            <el-radio :value="'1'">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </A_EDialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from "vue";
  import {
    ElMessage,
    FormInstance,
    FormRules,
    TableInstance,
  } from "element-plus";
  import {
    getDictTypeList,
    delDictTypes,
    addDictType,
    editDictType,
  } from "@/api/system/dict";
  import { DictTypeData } from "@/types/system/dict";
  import { validateLowerCaseAlphaNumericUnderscore } from "@/utils/formRegularExpression";
  import { debugLog } from "@/utils/debug";
  import { cloneDeep } from "lodash";
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm";
  import { usePaginationStore } from "@/stores/pagination";

  // 搜索表单
  const queryForm = reactive<DictTypeData>({
    status: "",
  });
  const dictTypeList = ref<DictTypeData[]>();
  const total = ref(0);
  const paginationStore = usePaginationStore();
  const currentPage = ref(1);
  // 获取字典类型列表
  const fetchDictTypeList = async () => {
    const res = await getDictTypeList({
      pageNum: currentPage.value,
      pageSize: paginationStore.pageSize,
      ...queryForm,
    });
    debugLog("字典类型列表=>", res);
    if (res.rows && res.total !== undefined) {
      dictTypeList.value = res.rows;
      total.value = res.total;
    } else ElMessage.error(res.msg || "获取字典类型列表失败");
  };
  onMounted(() => {
    fetchDictTypeList();
  });
  // 搜索
  const handleSearch = () => {
    currentPage.value = 1;
    fetchDictTypeList();
  };

  // 对话框相关
  const A_EVisible = ref(false);
  const A_ETitle = ref("");
  let A_EForm: DictTypeData;
  const defaultForm: DictTypeData = {
    dictName: "",
    dictType: "",
    status: "0",
  };
  const A_EFormRef = ref<FormInstance>();
  const rules: FormRules = {
    dictName: [
      { required: true, message: "请输入字典名称", trigger: "blur" },
      {
        max: 10,
        message: "字典名称最多10个字符",
        trigger: "blur",
      },
    ],
    dictType: [
      { required: true, message: "请输入字典类型", trigger: "blur" },
      { validator: validateLowerCaseAlphaNumericUnderscore, trigger: "blur" },
    ],
    status: [{ required: true, message: "请选择状态", trigger: "change" }],
  };
  // 表单提交
  const handleSubmit = async () => {
    A_EFormRef.value?.validate(async (valid) => {
      if (valid) {
        const res = await (A_EForm.dictId ? editDictType : addDictType)(
          A_EForm
        );
        debugLog(`${A_ETitle.value}结果=>`, res);
        if (res.code === 200) {
          A_EVisible.value = false;
          ElMessage.success(res.msg);
          fetchDictTypeList();
        } else ElMessage.error(res.msg || "提交失败");
      }
    });
  };

  // 新增字典类型
  const toAddDictType = () => {
    A_ETitle.value = "新增字典类型";
    A_EVisible.value = true;
    A_EForm = reactive(cloneDeep(defaultForm));
  };

  // 编辑字典类型
  const toEditDictType = (row: DictTypeData) => {
    A_ETitle.value = "编辑字典类型";
    // 只复制需要的属性
    A_EForm.dictId = row.dictId;
    A_EForm.dictName = row.dictName;
    A_EForm.dictType = row.dictType;
    A_EForm.status = row.status;
    A_EVisible.value = true;
  };

  // 删除字典类型
  const selectedDictTypes = ref<DictTypeData[]>([]);
  const handleSelectionChange = (selection: DictTypeData[]) => {
    selectedDictTypes.value = selection;
  };
  const dictTable = ref<TableInstance>();

  const toDelDictType = (row: DictTypeData) => {
    // 勾选被点击的行
    dictTable.value?.toggleRowSelection(row, true);
    elMessageBoxConfirm(
      `删除以下${
        selectedDictTypes.value.length
      }个字典类型ID: ${selectedDictTypes.value.map((item) => item.dictId)}`,
      async () => {
        const dictIds = selectedDictTypes.value
          .map((item) => item.dictId)
          .filter((id) => id !== undefined);
        const res = await delDictTypes(dictIds);
        debugLog("删除字典类型结果=>", res);
        if (res.code === 200) {
          ElMessage.success(res.msg);
          fetchDictTypeList();
        } else ElMessage.error(res.msg || "删除失败");
      }
    );
  };
</script>
