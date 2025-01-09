<template>
  <div>
    <!-- 搜索区域 -->
    <el-form :model="queryParams" class="d-flex align-items-center">
      <el-form-item label="参数名称" class="mx-md-2 flex-grow-1">
        <el-input
          v-model="queryParams.configName"
          placeholder="请输入参数名称"
          clearable />
      </el-form-item>
      <el-form-item label="参数键名" class="mx-md-2 flex-grow-1">
        <el-input
          v-model="queryParams.configKey"
          placeholder="请输入参数键名"
          clearable />
      </el-form-item>
      <el-form-item label="是否系统内置" class="mx-md-2">
        <el-select
          v-model="queryParams.configType"
          placeholder="全选"
          clearable
          style="width: 100px">
          <el-option
            v-for="option in dictStore.dictData.sys_yes_no"
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
              fetchConfigList();
            }
          "
          >搜索</el-button
        >
      </el-form-item>
      <el-form-item class="mx-md-2">
        <el-button type="primary" @click="toAddConfig">添加参数设置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table
      ref="configTable"
      :data="configList"
      table-layout="auto"
      cell-class-name="text-center"
      header-cell-class-name="text-center"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="30" />
      <el-table-column prop="configId" label="参数主键(ID)" />
      <el-table-column prop="configName" label="参数名称" />
      <el-table-column prop="configKey" label="参数键名" />
      <el-table-column prop="configValue" label="参数值" />
      <el-table-column label="系统内置">
        <template #default="{ row }">
          <el-tag
            :type="
              getTagTypeByDictData(
                row.configType,
                dictStore.dictData.sys_yes_no
              )
            ">
            {{
              getLabelByDictData(row.configType, dictStore.dictData.sys_yes_no)
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
            <Icon
              icon="icon-bianji"
              class="cursor-pointer"
              @click="toEditConfig(row)" />
            <Icon
              icon="icon-shanchu"
              class="cursor-pointer text-danger"
              @click="toDelConfig(row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <CustomPagination
      v-model:current-page="currentPage"
      :total="total"
      @size-change="refreshList"
      @current-change="fetchConfigList"
      class="mt-3" />

    <!-- 添加/修改参数 -->
    <A_EDialog
      v-model:A_EVisible="A_EVisible"
      :A_ETitle="A_ETitle"
      :submitForm="submitForm">
      <template #headerBtn>
        <span class="ms-2" v-if="!isAdd"
          >ID:{{ A_EFormData && A_EFormData["configId"] }}</span
        >
      </template>
      <el-form
        :model="A_EFormData"
        ref="A_EFormRef"
        label-width="auto"
        :rules="rules"
        v-if="A_EFormData">
        <el-form-item label="参数名称" prop="configName">
          <el-input
            v-model="A_EFormData.configName"
            placeholder="请输入参数名称"
            clearable />
        </el-form-item>
        <el-form-item label="参数键名" prop="configKey">
          <el-input
            v-model="A_EFormData.configKey"
            placeholder="请输入参数键名"
            clearable />
        </el-form-item>
        <el-form-item label="参数值" prop="configValue">
          <el-input
            v-model="A_EFormData.configValue"
            placeholder="请输入参数值"
            clearable />
        </el-form-item>
        <el-form-item label="系统内置" prop="configType">
          <el-radio-group v-model="A_EFormData.configType">
            <el-radio-button
              v-for="i in dictStore.dictData.sys_yes_no"
              :value="i.dictValue"
              >{{ i.dictLabel }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
      </el-form>
    </A_EDialog>
  </div>
</template>

<script lang="ts" setup>
  import {
    addConfig,
    delConfigs,
    editConfig,
    getConfigList,
  } from "@/api/system/config";
  import { useDictStore } from "@/stores/dictData";
  import { usePaginationStore } from "@/stores/pagination";
  import { ConfigItem } from "@/types/system/config";
  import { debugLog } from "@/utils/debug";
  import { ElMessage, FormRules, TableInstance } from "element-plus";
  import { onBeforeMount, onMounted, reactive, ref } from "vue";
  import {
    getTagTypeByDictData,
    getLabelByDictData,
  } from "@/utils/system/dict/dictDataToOptions";
  import { AxiosResponse } from "axios";
  import { cloneDeep } from "lodash";
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm";
  import {
    validateLowerCaseAlphaNumericDot,
    validateNoChineseOrSpaces,
  } from "@/utils/formRegularExpression";

  // 字典数据------------------
  const dictStore = useDictStore();
  onBeforeMount(() => {
    dictStore.fetchDictData("sys_yes_no");
  });

  // 请求参数设置------------
  const queryParams = reactive<
    Pick<ConfigItem, "configName" | "configKey" | "configType">
  >({});
  const configList = ref<ConfigItem[]>();
  const total = ref(0);
  const paginationStore = usePaginationStore();
  const currentPage = ref(1);
  const fetchConfigList = async () => {
    const res = await getConfigList({
      pageNum: currentPage.value,
      pageSize: paginationStore.pageSize,
      ...queryParams,
    });
    debugLog("参数设置列表=>", res);
    if (res.rows && res.total !== undefined) {
      configList.value = res.rows;
      total.value = res.total;
    } else ElMessage.error(res.msg || "获取参数设置列表失败");
  };
  const refreshList = () => {
    currentPage.value = 1;
    fetchConfigList();
  };
  onMounted(fetchConfigList);

  // 添加/修改参数表单----------------
  const isAdd = ref(true);
  const A_EVisible = ref(false);
  const A_ETitle = ref("");
  const defaultForm: ConfigItem = {
    configName: "",
    configKey: "",
    configValue: "",
  };
  let A_EFormData: ConfigItem;
  let A_EFun: (data: ConfigItem) => Promise<AxiosResponse>;
  const rules: FormRules = {
    configName: [
      { required: true, message: "请输入参数名称", trigger: "blur" },
    ],
    configKey: [
      { required: true, message: "请输入参数键名", trigger: "blur" },
      { validator: validateLowerCaseAlphaNumericDot, trigger: "blur" },
    ],
    configValue: [
      { required: true, message: "请输入参数值", trigger: "blur" },
      {
        validator: validateNoChineseOrSpaces,
        trigger: "blur",
      },
    ],
    configType: [
      { required: true, message: "请选择是否系统内置", trigger: "blur" },
    ],
  };

  // 提交表单-----------------
  const A_EFormRef = ref();
  const submitForm = async () => {
    A_EFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        const res = await A_EFun(A_EFormData);
        debugLog(`${A_ETitle.value}结果=>`, res);
        if (res.code === 200) {
          ElMessage.success(`${A_ETitle.value}成功`);
          A_EVisible.value = false;
          fetchConfigList();
        } else ElMessage.error(res.msg || `${A_ETitle.value}失败`);
      }
    });
  };

  // 打开新增参数对话框-----------
  const toAddConfig = () => {
    A_ETitle.value = "新增参数设置";
    isAdd.value = true;
    A_EFun = addConfig;
    A_EFormData = reactive(cloneDeep(defaultForm));
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
  };

  // 打开编辑参数对话框-------------
  const toEditConfig = (row: ConfigItem) => {
    A_ETitle.value = "修改参数";
    isAdd.value = false;
    A_EFun = editConfig;
    A_EFormData = reactive({
      configId: row.configId,
      configName: row.configName,
      configKey: row.configKey,
      configValue: row.configValue,
      configType: row.configType,
    });
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
  };

  // 删除参数设置--------------
  const selectedConfigs = ref<ConfigItem[]>([]);
  const configTable = ref<TableInstance>();
  const handleSelectionChange = (selection: ConfigItem[]) => {
    selectedConfigs.value = selection;
  };
  const toDelConfig = (row: ConfigItem) => {
    // 勾选被点击的行
    configTable.value?.toggleRowSelection(row, true);
    elMessageBoxConfirm(
      `删除以下${
        selectedConfigs.value.length
      }个参数设置 ID: ${selectedConfigs.value.map((i) => i.configId)}`,
      async () => {
        const configIds = selectedConfigs.value
          .map((i) => i.configId)
          .filter((id) => id !== undefined);
        const res = await delConfigs(configIds);
        debugLog("删除参数设置=>", res);
        if (res.code === 200) {
          ElMessage.success("删除成功"); // 清空选中
          selectedConfigs.value = [];
          fetchConfigList();
        } else ElMessage.error(res.msg || "删除失败");
      }
    );
  };
</script>
