<template>
  <div>
    <!-- 搜索区域 -->
    <el-form :model="queryParams" class="d-flex align-items-center">
      <el-form-item label="字典名称" class="mx-md-2 flex-grow-1">
        <el-input
          v-model="queryParams.dictName"
          placeholder="请输入字典名称"
          clearable />
      </el-form-item>
      <el-form-item label="字典类型" class="mx-md-2 flex-grow-1">
        <el-input
          v-model="queryParams.dictType"
          placeholder="请输入字典类型"
          clearable />
      </el-form-item>
      <el-form-item label="状态" class="mx-md-2">
        <el-select
          v-model="queryParams.status"
          placeholder="全选"
          clearable
          style="width: 100px">
          <el-option
            v-for="option in dictStore.dictData.sys_normal_disable"
            :key="option.dictCode"
            :label="option.dictLabel"
            :value="option.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item class="mx-md-2">
        <el-button
          type="primary"
          @click="
            () => {
              currentPage = 1;
              fetchDictTypeList();
            }
          "
          >搜索</el-button
        >
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
      <el-table-column label="停用">
        <template #default="{ row }">
          <el-tag
            :type="
              getTagTypeByDictData(
                row.status,
                dictStore.dictData.sys_normal_disable
              )
            ">
            {{
              getLabelByDictData(
                row.status,
                dictStore.dictData.sys_normal_disable
              )
            }}
          </el-tag>
        </template>
      </el-table-column>
      <DataTebleColumnTime />
      <el-table-column label="操作">
        <template #default="{ row }">
          <div
            class="d-flex justify-content-around align-items-center"
            v-if="!row.admin">
            <div
              class="d-flex align-items-center cursor-pointer text-success"
              @click="openDictDataDrawer(row)">
              管理字典数据
              <Icon icon="icon-shujuzidian_shujuzidian" class="ms-1" />
            </div>
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
      @size-change="refreshList"
      @current-change="fetchDictTypeList"
      class="mt-3" />

    <!-- 新增/编辑对话框 -->
    <A_EDialog
      v-model:A_EVisible="A_EVisible"
      :A_ETitle="A_ETitle"
      :submitForm="handleSubmit">
      <template #headerBtn>
        <span class="ms-2" v-if="isEditingDictType && A_EFormData.dictId">
          ID:{{ A_EFormData.dictId }}
        </span>
        <span
          class="ms-2"
          v-if="!isEditingDictType && dictDataFormData.dictCode">
          ID:{{ dictDataFormData.dictCode }}
        </span>
      </template>

      <!-- 字典类型表单 -->
      <el-form
        v-if="isEditingDictType"
        :model="A_EFormData"
        label-width="auto"
        :rules="rules"
        ref="A_EFormRef">
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="A_EFormData.dictName" clearable />
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="A_EFormData.dictType" clearable />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="A_EFormData.status">
            <el-radio-button
              v-for="i in dictStore.dictData.sys_normal_disable"
              :value="i.dictValue"
              >{{ i.dictLabel }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
      </el-form>

      <!-- 字典数据表单 -->
      <el-form
        v-else
        :model="dictDataFormData"
        label-width="auto"
        :rules="dictDataRules"
        ref="dictDataFormRef">
        <el-form-item label="父字典类型" prop="dictType">
          <el-input v-model="dictDataFormData.dictType" disabled />
        </el-form-item>
        <el-form-item label="数据标签" prop="dictLabel">
          <el-input v-model="dictDataFormData.dictLabel" clearable />
        </el-form-item>
        <el-form-item label="数据键值" prop="dictValue">
          <el-input v-model="dictDataFormData.dictValue" clearable />
        </el-form-item>
        <div class="d-flex align-items-center justify-content-between">
          <el-form-item label="显示排序" prop="dictSort">
            <el-input-number v-model="dictDataFormData.dictSort" :min="0" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="dictDataFormData.status">
              <el-radio-button
                v-for="i in dictStore.dictData.sys_normal_disable"
                :value="i.dictValue"
                >{{ i.dictLabel }}</el-radio-button
              >
            </el-radio-group>
          </el-form-item>
        </div>
        <el-form-item label="样式属性" prop="cssClass">
          <el-input v-model="dictDataFormData.cssClass" clearable />
        </el-form-item>
        <el-form-item label="回显样式" prop="listClass">
          <el-select
            v-model="dictDataFormData.listClass"
            placeholder="可选择回显样式">
            <el-option label="默认(default)" value="default" />
            <el-option label="主要(primary)" value="primary" />
            <el-option label="成功(success)" value="success" />
            <el-option label="信息(info)" value="info" />
            <el-option label="警告(warning)" value="warning" />
            <el-option label="危险(danger)" value="danger" />
          </el-select>
        </el-form-item>
      </el-form>
    </A_EDialog>

    <!-- 字典数据抽屉 -->
    <el-drawer v-model="drawerVisible" size="50%">
      <template #header>
        <div class="d-flex align-items-center justify-content-between">
          <el-button type="primary" @click="toAddDictData"
            >添加字典数据</el-button
          >{{ `字典数据 - ${currentDictType?.dictName}` }}
        </div>
      </template>
      <el-table
        ref="dictDataTable"
        :data="dictDataList"
        table-layout="auto"
        cell-class-name="text-center"
        header-cell-class-name="text-center"
        @selection-change="handleDictDataSelectionChange">
        <el-table-column type="selection" width="30" />
        <el-table-column prop="dictCode" label="编码" />
        <el-table-column prop="dictLabel" label="数据标签" />
        <el-table-column prop="dictValue" label="数据键值" />
        <el-table-column prop="dictSort" label="显示排序" />
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
            <div class="d-flex justify-content-around align-items-center">
              <Icon
                icon="icon-bianji"
                class="cursor-pointer"
                @click="toEditDictData(row)" />
              <Icon
                icon="icon-shanchu"
                class="cursor-pointer text-danger"
                @click="toDelDictData(row)" />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <CustomPagination
        v-model:current-page="dictDataCurrentPage"
        :total="dictDataTotal"
        @size-change="refreshList2"
        @current-change="fetchDictDataList"
        class="mt-3" />
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
  /**
   * @file Dict Management Component
   * @description 负责字典类型和字典数据的管理，包括增删改查功能。
   * @module DictManagement
   * @author
   * @date
   */

  // 导入Vue相关API
  import { ref, reactive, onMounted, onBeforeMount } from "vue";
  // 导入Element Plus组件类型
  import {
    ElMessage,
    FormInstance,
    FormRules,
    TableInstance,
  } from "element-plus";
  // 导入API函数
  import {
    getDictTypeList,
    delDictTypes,
    addDictType,
    editDictType,
    getDictDataList,
    delDictData,
    editDictData,
    addDictData,
  } from "@/api/system/dict";
  // 导入类型定义
  import { DictDataItem, DictTypeItem } from "@/types/system/dict";
  // 导入工具函数
  import {
    validateLowerCaseAlphaNumericUnderscore,
    validateNoChineseOrSpaces,
  } from "@/utils/formRegularExpression";
  import { debugLog } from "@/utils/debug";
  import { cloneDeep } from "lodash";
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm";
  // 导入状态管理
  import { usePaginationStore } from "@/stores/pagination";
  import { useDictStore } from "@/stores/dictData";
  import {
    getTagTypeByDictData,
    getLabelByDictData,
  } from "@/utils/system/dict/dictDataToOptions";

  /**
   * @description 初始化字典数据
   */
  const dictStore = useDictStore();
  onBeforeMount(() => {
    dictStore.fetchDictData("sys_normal_disable");
  });

  // 搜索表单状态
  const queryParams = reactive<DictTypeItem>({
    status: "",
  });

  // 字典类型列表及分页状态
  const dictTypeList = ref<DictTypeItem[]>();
  const total = ref(0);
  const paginationStore = usePaginationStore();
  const currentPage = ref(1);

  /**
   * @description 获取字典类型列表
   */
  const fetchDictTypeList = async () => {
    const res = await getDictTypeList({
      pageNum: currentPage.value,
      pageSize: paginationStore.pageSize,
      ...queryParams,
    });
    debugLog("字典类型列表=>", res);
    if (res.rows && res.total !== undefined) {
      dictTypeList.value = res.rows;
      total.value = res.total;
    } else {
      ElMessage.error(res.msg || "获取字典类型列表失败");
    }
  };

  // 页面挂载时获取字典类型列表
  onMounted(fetchDictTypeList);

  /**
   * @description 刷新字典类型列表
   */
  const refreshList = () => {
    currentPage.value = 1;
    fetchDictTypeList();
  };

  // 字典类型表单状态
  const A_EVisible = ref(false);
  const A_ETitle = ref("");
  const isEditingDictType = ref(true);
  let A_EFormData: DictTypeItem;
  const defaultForm: DictTypeItem = {
    dictName: "",
    dictType: "",
    status: "0",
  };

  /**
   * @description 新增字典类型
   */
  const toAddDictType = () => {
    isEditingDictType.value = true;
    A_ETitle.value = "新增字典类型";
    A_EFormData = reactive(cloneDeep(defaultForm));
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
  };

  /**
   * @description 编辑字典类型
   * @param {DictTypeItem} row - 字典类型数据
   */
  const toEditDictType = (row: DictTypeItem) => {
    isEditingDictType.value = true;
    A_ETitle.value = "编辑字典类型";
    // 只复制需要的属性
    A_EFormData = reactive({
      dictId: row.dictId,
      dictName: row.dictName,
      dictType: row.dictType,
      status: row.status,
    });
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
  };

  // 选中的字典类型列表
  const selectedDictTypes = ref<DictTypeItem[]>([]);

  /**
   * @description 处理表格行选择变化
   * @param {DictTypeItem[]} selection - 当前选中的行
   */
  const handleSelectionChange = (selection: DictTypeItem[]) => {
    selectedDictTypes.value = selection;
  };

  // 字典类型表格实例
  const dictTable = ref<TableInstance>();

  /**
   * @description 删除字典类型
   * @param {DictTypeItem} row - 字典类型数据
   */
  const toDelDictType = (row: DictTypeItem) => {
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
        } else {
          ElMessage.error(res.msg || "删除失败");
        }
      }
    );
  };

  // 字典数据相关状态
  const drawerVisible = ref(false);
  const currentDictType = ref<DictTypeItem>();
  const dictDataList = ref<DictDataItem[]>([]);
  const dictDataTotal = ref(0);
  const dictDataCurrentPage = ref(1);

  /**
   * @description 获取字典数据列表
   */
  const fetchDictDataList = async () => {
    if (!currentDictType.value) return;
    const res = await getDictDataList({
      pageNum: dictDataCurrentPage.value,
      pageSize: paginationStore.pageSize,
      dictType: currentDictType.value.dictType,
    });
    debugLog("字典数据列表=>", res);
    if (res.rows && res.total !== undefined) {
      dictDataList.value = res.rows;
      dictDataTotal.value = res.total;
    } else {
      ElMessage.error(res.msg || "获取字典数据列表失败");
    }
  };

  /**
   * @description 刷新字典数据列表
   */
  const refreshList2 = () => {
    currentPage.value = 1;
    fetchDictDataList();
  };

  /**
   * @description 打开字典数据抽屉
   * @param {DictTypeItem} row - 字典类型数据
   */
  const openDictDataDrawer = (row: DictTypeItem) => {
    currentDictType.value = row;
    drawerVisible.value = true;
    dictDataCurrentPage.value = 1;
    fetchDictDataList();
  };

  // 字典数据表单状态
  let dictDataFormData: DictDataItem;
  const dictDatadefaultForm: DictDataItem = {
    status: "0",
    dictSort: 0,
  };

  /**
   * @description 新增字典数据
   */
  const toAddDictData = () => {
    isEditingDictType.value = false;
    A_ETitle.value = "新增字典数据";
    dictDataFormData = reactive({
      dictType: currentDictType.value?.dictType,
      ...dictDatadefaultForm,
    });
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
  };

  /**
   * @description 编辑字典数据
   * @param {DictDataItem} row - 字典数据
   */
  const toEditDictData = (row: DictDataItem) => {
    isEditingDictType.value = false;
    A_ETitle.value = "编辑字典数据";
    dictDataFormData = reactive({
      dictCode: row.dictCode,
      dictType: row.dictType,
      dictLabel: row.dictLabel,
      dictSort: row.dictSort,
      dictValue: row.dictValue,
      cssClass: row.cssClass,
      listClass: row.listClass,
      status: row.status,
    });
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
  };

  // 选中的字典数据列表
  const selectedDictData = ref<DictDataItem[]>([]);

  /**
   * @description 处理字典数据表格行选择变化
   * @param {DictDataItem[]} selection - 当前选中的行
   */
  const handleDictDataSelectionChange = (selection: DictDataItem[]) => {
    selectedDictData.value = selection;
  };

  // 字典数据表格实例
  const dictDataTable = ref<TableInstance>();

  /**
   * @description 删除字典数据
   * @param {DictDataItem} row - 字典数据
   */
  const toDelDictData = (row: DictDataItem) => {
    dictDataTable.value?.toggleRowSelection(row, true);
    elMessageBoxConfirm(
      `删除以下${
        selectedDictData.value.length
      }个字典数据 ID: ${selectedDictData.value.map((item) => item.dictCode)}`,
      async () => {
        const dictCodes = selectedDictData.value
          .map((item) => item.dictCode)
          .filter((id) => id !== undefined);
        const res = await delDictData(dictCodes);
        debugLog("删除字典数据结果=>", res);
        if (res.code === 200) {
          ElMessage.success(res.msg);
          fetchDictDataList();
        } else {
          ElMessage.error(res.msg || "删除失败");
        }
      }
    );
  };

  // 表单引用及校验规则
  const A_EFormRef = ref<FormInstance>();
  const dictDataFormRef = ref<FormInstance>();
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
  const dictDataRules: FormRules = {
    dictLabel: [
      { required: true, message: "请输入数据标签", trigger: "blur" },
      { max: 30, message: "数据标签长度不能超过30个字符", trigger: "blur" },
    ],
    dictValue: [
      { required: true, message: "请输入数据键值", trigger: "blur" },
      { max: 30, message: "数据键值长度不能超过30个字符", trigger: "blur" },
      { validator: validateNoChineseOrSpaces, trigger: "blur" },
    ],
    dictSort: [
      { required: true, message: "请输入显示排序", trigger: "blur" },
      { type: "number", message: "显示排序必须为数字值", trigger: "blur" },
    ],
    status: [{ required: true, message: "请选择状态", trigger: "change" }],
    cssClass: [
      { max: 100, message: "样式属性长度不能超过100个字符", trigger: "blur" },
    ],
  };

  /**
   * @description 表单提交处理
   */
  const handleSubmit = async () => {
    const formRef = isEditingDictType.value
      ? A_EFormRef.value
      : dictDataFormRef.value;
    formRef?.validate(async (valid) => {
      if (valid) {
        let res;
        if (isEditingDictType.value) {
          res = await (A_EFormData.dictId ? editDictType : addDictType)(
            A_EFormData
          );
        } else {
          res = await (dictDataFormData.dictCode ? editDictData : addDictData)(
            dictDataFormData
          );
        }

        debugLog(`${A_ETitle.value}结果=>`, res);
        if (res.code === 200) {
          A_EVisible.value = false;
          ElMessage.success(res.msg);
          isEditingDictType.value ? fetchDictTypeList() : fetchDictDataList();
        } else {
          ElMessage.error(res.msg || "提交失败");
        }
      }
    });
  };
</script>
<style lang="scss" scoped>
  :deep(.el-drawer__body) {
    padding-top: 0 !important;
  }
</style>
