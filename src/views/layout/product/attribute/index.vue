<template>
  <div>
    <!-- 搜索表单 -->
    <el-form :model="queryParams" class="d-flex align-items-center">
      <el-form-item>
        <el-radio-group
          v-model="queryParams.type"
          class="flex-shrink-0 mx-md-2"
          @change="handleTypeChange">
          <el-radio-button label="规格" :value="'0'" />
          <el-radio-button label="参数" :value="'1'" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="属性名称" class="mx-md-2 flex-grow-1">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入规格/参数的名称"
          clearable />
      </el-form-item>
      <el-form-item label="选择类型" class="mx-md-2">
        <el-select
          v-model="queryParams.selectType"
          placeholder=""
          clearable
          style="width: 80px">
          <el-option label="唯一" :value="0" />
          <el-option label="单选" :value="1" />
          <el-option label="多选" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="录入方式" class="mx-md-2">
        <el-select
          v-model="queryParams.inputType"
          placeholder=""
          clearable
          style="width: 110px">
          <el-option label="手工录入" :value="0" />
          <el-option label="列表选择" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否关联" class="mx-md-2">
        <el-select
          v-model="queryParams.relatedStatus"
          placeholder=""
          clearable
          style="width: 70px">
          <el-option label="否" :value="0" />
          <el-option label="是" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="支持手动新增" class="mx-md-2">
        <el-select
          v-model="queryParams.handAddStatus"
          placeholder=""
          clearable
          style="width: 70px">
          <el-option label="否" :value="0" />
          <el-option label="是" :value="1" />
        </el-select>
      </el-form-item>

      <el-form-item class="mx-md-2">
        <el-button
          type="primary"
          @click="
            () => {
              currentPage = 1;
              fetchAttributeList();
            }
          "
          >搜索</el-button
        >
      </el-form-item>

      <el-form-item class="mx-md-2">
        <el-button type="primary" @click="toAddAttribute">添加属性</el-button>
      </el-form-item>
    </el-form>

    <!-- 属性列表表格 -->
    <el-table
      ref="attributeTable"
      :data="attributeList"
      table-layout="auto"
      cell-class-name="text-center"
      header-cell-class-name="text-center">
      <el-table-column type="selection" width="30" />
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="name" label="属性名称" />
      <el-table-column prop="selectType" label="选择类型">
        <template #default="scope: { row: RowData }">
          {{ selectTypeMap[scope.row.selectType] }}
        </template>
      </el-table-column>
      <el-table-column prop="inputType" label="录入方式">
        <template #default="scope: { row: RowData }">
          {{ inputTypeMap[scope.row.inputType] }}
        </template>
      </el-table-column>
      <el-table-column prop="inputList" label="可选值列表" />
      <el-table-column prop="sort" label="排序" />
      <DataTebleColumnTime />
      <el-table-column label="操作">
        <template #default="{ row }">
          <div class="d-flex justify-content-around align-items-center">
            <Icon
              icon="icon-bianji"
              class="cursor-pointer"
              @click="toEditAttribute(row)" />
            <Icon
              icon="icon-shanchu"
              class="cursor-pointer text-danger"
              @click="" />
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <CustomPagination
      v-model:current-page="currentPage"
      :total="total"
      @size-change="fetchAttributeList"
      @current-change="fetchAttributeList"
      class="mt-3" />

    <!-- 添加/修改属性弹窗 -->
    <A_EDialog
      v-model:A_EVisible="A_EVisible"
      :A_ETitle="A_ETitle"
      :submitForm="submitForm">
      <template #headerBtn>
        <span class="ms-2" v-if="!isAdd"
          >ID:{{ A_EForm && A_EForm["id"] }}</span
        >
      </template>
      <el-form
        :model="A_EForm"
        ref="A_EFormRef"
        label-width="auto"
        :rules="rules"
        v-if="A_EForm">
        <el-form-item label="属性名称" prop="name">
          <el-input
            v-model="A_EForm.name"
            placeholder="请输入属性名称"
            clearable />
        </el-form-item>
        <el-form-item label="属性选择类型" prop="selectType">
          <el-select
            v-model="A_EForm.selectType"
            placeholder="请选择属性选择类型">
            <el-option label="唯一" :value="0" />
            <el-option label="单选" :value="1" />
            <el-option label="多选" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="属性录入方式" prop="inputType">
          <el-radio-group v-model="A_EForm.inputType">
            <el-radio-button label="手工录入" :value="'0'" />
            <el-radio-button label="列表选择" :value="'1'" />
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="可选值列表"
          prop="inputList"
          v-if="A_EForm.inputType === 1">
          <el-input
            v-model="A_EForm.inputList"
            type="textarea"
            :rows="4"
            placeholder="请输入可选值列表，以逗号隔开" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="A_EForm.sort" :min="0" />
        </el-form-item>
        <el-form-item label="属性类型" prop="type">
          <el-radio-group v-model="A_EForm.type">
            <el-radio-button label="规格" :value="'0'" />
            <el-radio-button label="参数" :value="'1'" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否支持手动新增" prop="handAddStatus">
          <el-switch
            v-model="A_EForm.handAddStatus"
            :active-value="1"
            :inactive-value="0" />
        </el-form-item>
        <el-form-item label="是否关联" prop="relatedStatus">
          <el-switch
            v-model="A_EForm.relatedStatus"
            :active-value="1"
            :inactive-value="0" />
        </el-form-item>
      </el-form>
    </A_EDialog>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useRouteParamsValidation } from "@/utils/router/useRouteParamsValidation";
  import {
    AttributeItem,
    GetAttributeListParams,
  } from "@/types/product/attribute";
  import { usePaginationStore } from "@/stores/pagination";
  import { ElMessage, FormInstance, FormRules } from "element-plus";
  import {
    addAttribute,
    editAttribute,
    getAttributeList,
  } from "@/api/product/attribute";
  import { debugLog } from "@/utils/debug";
  import { cloneDeep } from "lodash";

  // 验证路由参数-----------------------------------
  useRouteParamsValidation({
    requiredParams: ["cid", "type"],
  });
  const route = useRoute();
  const router = useRouter();

  // 获取数据------------------------------
  interface RowData {
    selectType: 0 | 1 | 2;
    inputType: 0 | 1;
  }
  const selectTypeMap = {
    0: "唯一",
    1: "单选",
    2: "多选",
  };
  const inputTypeMap = {
    0: "手工录入",
    1: "列表选择",
  };

  // 表格数据
  const attributeList = ref<AttributeItem[]>([]);
  const currentPage = ref(1);
  const total = ref(0);
  const paginationStore = usePaginationStore();
  // 查询参数
  const queryParams = reactive<GetAttributeListParams>({
    type: undefined,
    name: "",
    selectType: undefined,
    inputType: undefined,
    relatedStatus: undefined,
    handAddStatus: undefined,
  });
  // 获取属性列表
  const fetchAttributeList = async () => {
    const cid = route.query.cid as string;
    if (!cid) {
      debugLog("cid未传入");
      return;
    }

    const res = await getAttributeList(cid, {
      pageNum: currentPage.value,
      pageSize: paginationStore.pageSize,
      ...queryParams,
    });
    debugLog(
      `查询属性分类cid:${cid}的${queryParams.type ? "规格" : "参数"}=>`,
      res
    );

    if (res.code === 200) {
      attributeList.value = res.rows || [];
      total.value = res.total || 0;
    } else ElMessage.error(res.msg || "获取属性列表失败");
  };
  watch(
    () => route.query.type,
    (newType) => {
      queryParams.type = newType as string;
      fetchAttributeList();
    },
    { immediate: true } // 确保首次加载时执行
  );

  // 修改 规格/参数---------------------
  const handleTypeChange = (value: string) => {
    router.push({
      path: route.path,
      query: {
        ...route.query,
        type: value,
      },
    });
  };

  // 表单相关逻辑--------------------
  const isAdd = ref(true);
  const A_EVisible = ref(false);
  const A_ETitle = ref("");
  const defaultForm: AttributeItem = {
    productAttributeCategoryId: 0, // 需要从父组件传入
    name: "",
    selectType: 0,
    inputType: 0,
    inputList: "",
    sort: 0,
    relatedStatus: 0,
    handAddStatus: 0,
    type: 0,
  };

  let A_EForm: AttributeItem;

  const rules: FormRules = {
    name: [
      { required: true, message: "请输入属性名称", trigger: "blur" },
      { min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
    ],
    selectType: [
      { required: true, message: "请选择属性选择类型", trigger: "change" },
    ],
    inputType: [
      { required: true, message: "请选择属性录入方式", trigger: "change" },
    ],
    inputList: [
      {
        required: true,
        message: "请输入可选值列表",
        trigger: "blur",
        validator: (_rule, value, callback) => {
          if (A_EForm.inputType === 1 && !value) {
            callback(new Error("请输入可选值列表"));
          } else {
            callback();
          }
        },
      },
    ],
    sort: [{ required: true, message: "请输入排序值", trigger: "blur" }],
    type: [{ required: true, message: "请选择属性类型", trigger: "change" }],
  };

  // 提交表单
  const A_EFormRef = ref<FormInstance>();
  const submitForm = async () => {
    A_EFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        const res = isAdd.value
          ? await addAttribute(A_EForm)
          : await editAttribute(A_EForm, A_EForm.id!);
        debugLog(`${A_ETitle.value}结果=>`, res);
        if (res.code === 200) {
          ElMessage.success(`${A_ETitle.value}成功`);
          A_EVisible.value = false;
          // 刷新列表
          fetchAttributeList();
        } else ElMessage.error(res.msg || `${A_ETitle.value}失败`);
      }
    });
  };

  // 添加属性
  const toAddAttribute = (categoryId: number) => {
    A_ETitle.value = "添加属性";
    isAdd.value = true;
    A_EForm = reactive({
      ...cloneDeep(defaultForm),
      productAttributeCategoryId: categoryId,
    });
    A_EVisible.value = true;
  };

  // 修改属性
  const toEditAttribute = (data: AttributeItem) => {
    A_ETitle.value = "修改属性";
    isAdd.value = false;
    A_EForm = reactive(cloneDeep(data));
    A_EVisible.value = true;
  };
</script>
