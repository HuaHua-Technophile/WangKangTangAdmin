<template>
  <div>
    <!-- 搜索表单 -->
    <div class="d-flex align-items-center">
      <el-radio-group
        v-model="type"
        class="flex-flow-1 mx-md-2"
        @change="handleTypeChange">
        <el-radio-button label="规格" :value="'0'" />
        <el-radio-button label="参数" :value="'1'" />
      </el-radio-group>
      <el-button type="primary" @click="toAddAttribute"
        >添加{{ type == 0 ? "规格" : "参数" }}</el-button
      >
    </div>
    <!-- 属性列表表格 -->
    <el-table
      ref="attributeTable"
      :data="attributeList"
      table-layout="auto"
      cell-class-name="text-center"
      header-cell-class-name="text-center"
      @selection-change="handleAttributeSelectionChange">
      <el-table-column type="selection" width="30" />
      <el-table-column prop="id" label="ID" />
      <el-table-column
        prop="name"
        :label="`${type == 0 ? '参数名称' : '参数名称'}`" />
      <el-table-column prop="selectType" label="选择类型">
        <template #default="{ row }">
          {{
            row.selectType == 0 ? "唯一" : row.selectType == 1 ? "单选" : "多选"
          }}
        </template>
      </el-table-column>
      <el-table-column prop="inputType" label="录入方式">
        <template #default="{ row }">
          {{ row.inputType == 0 ? "手工录入" : "列表选择" }}
        </template>
      </el-table-column>
      <el-table-column prop="inputList" label="可选值(列表)" />
      <el-table-column prop="handAddStatus" label="支持手动新增">
        <template #default="{ row }">
          <el-tag :type="row.handAddStatus == 0 ? 'danger' : 'primary'">
            {{ row.handAddStatus == 0 ? "否" : "是" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="relatedStatus" label="药品属性关联">
        <template #default="{ row }">
          <el-tag :type="row.relatedStatus == 0 ? 'danger' : 'primary'">
            {{ row.relatedStatus == 0 ? "否" : "是" }}
          </el-tag>
        </template>
      </el-table-column>
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
              @click="toDelAttribute(row)" />
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
      :submitForm="submitForm"
      width="630">
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
        <el-form-item label="父级属性分类">
          <el-input v-model="route.query.father" disabled />
        </el-form-item>
        <el-form-item label="属性类型" prop="type">
          <el-radio-group v-model="A_EFormData.type" disabled>
            <el-radio-button label="规格" :value="0" />
            <el-radio-button label="参数" :value="1" />
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="`${type == 0 ? '规格' : '参数'}名称`" prop="name">
          <el-input
            v-model="A_EFormData.name"
            :placeholder="`请输入${type == 0 ? '规格' : '参数'}名称`"
            clearable />
        </el-form-item>
        <div class="d-flex align-items-center justify-content-between">
          <el-form-item
            :label="`${type == 0 ? '规格' : '参数'}选择类型`"
            prop="selectType">
            <el-radio-group v-model="A_EFormData.selectType">
              <el-radio-button label="唯一" :value="0" />
              <el-radio-button label="单选" :value="1" />
              <el-radio-button label="多选" :value="2" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="A_EFormData.sort" :min="0" />
          </el-form-item>
        </div>
        <div class="d-flex align-items-center justify-content-between">
          <el-form-item label="是否支持手动新增" prop="handAddStatus">
            <el-switch
              v-model="A_EFormData.handAddStatus"
              :active-value="1"
              :inactive-value="0"
              :disabled="A_EFormData.selectType == 0 && type == 0" />
          </el-form-item>
          <el-form-item label="药品属性关联" prop="relatedStatus">
            <el-switch
              v-model="A_EFormData.relatedStatus"
              :active-value="1"
              :inactive-value="0" />
          </el-form-item>
        </div>
        <el-form-item
          :label="`${type == 0 ? '规格' : '参数'}录入方式`"
          prop="inputType">
          <el-radio-group
            v-model="A_EFormData.inputType"
            :disabled="A_EFormData.selectType == 0">
            <el-radio-button label="手工录入" :value="0" />
            <el-radio-button label="列表选择" :value="1" />
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="可选值列表"
          prop="inputList"
          v-show="A_EFormData.inputType === 1">
          <el-input-tag
            v-model="inputListArray"
            placeholder="请添加可选值选项，'回车键'/'Tab键'添加输入内容" />
        </el-form-item>
        <el-form-item
          label="可选值手动录入"
          prop="inputList"
          v-show="A_EFormData.inputType != 1">
          <el-input
            v-model="A_EFormData.inputList"
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 10 }"
            placeholder="请自行录入" />
        </el-form-item>
      </el-form>
    </A_EDialog>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch, computed } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useRouteParamsValidation } from "@/utils/router/useRouteParamsValidation";
  import { AttributeItem } from "@/types/product/attribute";
  import { usePaginationStore } from "@/stores/pagination";
  import {
    ElMessage,
    FormInstance,
    FormRules,
    TableInstance,
  } from "element-plus";
  import {
    addAttribute,
    delAttribute,
    editAttribute,
    getAttributeList,
  } from "@/api/product/attribute";
  import { debugLog } from "@/utils/debug";
  import { cloneDeep } from "lodash";
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm";

  // 验证路由参数-----------------------------------
  useRouteParamsValidation({
    requiredParams: ["cid", "type", "father"],
  });
  const route = useRoute();
  const router = useRouter();

  // 表格数据
  const attributeList = ref<AttributeItem[]>([]);
  const currentPage = ref(1);
  const total = ref(0);
  const paginationStore = usePaginationStore();
  // 查询参数
  const type = ref<0 | 1>();
  const defaultForm: AttributeItem = {
    productAttributeCategoryId: 0, // 需要从父组件传入
    type: 0,
    name: "",
    selectType: 1,
    inputType: 0,
    inputList: "",
    sort: 0,
    relatedStatus: 0,
    handAddStatus: 0,
  };
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
      type: type.value!,
    });
    debugLog(`查询属性分类cid:${cid}的${type.value ? "规格" : "参数"}=>`, res);

    if (res.code === 200) {
      attributeList.value = res.rows || [];
      total.value = res.total || 0;
    } else ElMessage.error(res.msg || "获取属性列表失败");
  };
  watch(
    () => route.query.type,
    (newType) => {
      type.value = newType as unknown as 0 | 1;
      defaultForm.type = newType as unknown as 0 | 1;
      fetchAttributeList();
    },
    { immediate: true } // 确保首次加载时执行
  );

  // 修改顶部左边的 规格/参数---------------------
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
  let A_EFormData: AttributeItem = reactive(cloneDeep(defaultForm));

  // 计算属性：将字符串转换为数组
  const inputListArray = computed({
    get: () => (A_EFormData.inputList ? A_EFormData.inputList.split(",") : []),
    set: (newValue: string[]) => {
      A_EFormData.inputList = newValue.join(",");
    },
  });
  const rules: FormRules = {
    name: [
      { required: true, message: "请输入属性名称", trigger: "blur" },
      { min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
    ],
    // 选择类型验证
    selectType: [
      {
        validator: (_rule, value, callback) => {
          // 当选择类型为唯一值(0)时
          if (value === 0) {
            A_EFormData.inputType = 0; // 强制设置为手工录入
            if (type.value == 0) A_EFormData.handAddStatus = 0; // 强制禁止手动新增
          }
          callback();
        },
        trigger: "change",
      },
    ],
    inputList: [
      {
        trigger: "blur",
        validator: (_rule, value, callback) => {
          if (!A_EFormData.handAddStatus && !value)
            callback(
              new Error(
                `必须在该页面完成添加${type.value == 0 ? "规格" : "参数"}`
              )
            );
          else callback();
        },
      },
    ],
  };

  // 提交表单----------------------------------------------
  const A_EFormRef = ref<FormInstance>();
  const submitForm = async () => {
    A_EFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        const res = isAdd.value
          ? await addAttribute(A_EFormData)
          : await editAttribute(A_EFormData, A_EFormData.id!);
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
  const toAddAttribute = () => {
    isAdd.value = true;
    A_ETitle.value = type.value == 0 ? "添加规格" : "添加参数";
    Object.assign(A_EFormData, {
      ...cloneDeep(defaultForm),
      productAttributeCategoryId: Number(route.query.cid),
    });
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
  };
  // 修改属性
  const toEditAttribute = (data: AttributeItem) => {
    A_ETitle.value = type.value == 0 ? "修改规格" : "修改参数";
    isAdd.value = false;
    Object.assign(A_EFormData, cloneDeep(data));
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
  };

  // 声明选中的属性数组和表格引用
  const selectedAttributes = ref<AttributeItem[]>([]);
  const attributeTable = ref<TableInstance>();

  // 表格选择改变处理函数
  const handleAttributeSelectionChange = (selection: AttributeItem[]) => {
    selectedAttributes.value = selection;
  };

  // 删除属性处理函数
  const toDelAttribute = (row: AttributeItem) => {
    // 选中当前行
    attributeTable.value?.toggleRowSelection(row, true);

    // 确认删除对话框
    elMessageBoxConfirm(
      `删除以下${
        selectedAttributes.value.length
      }个属性 ID: ${selectedAttributes.value.map((item) => item.id)}`,
      async () => {
        // 获取所有选中项的ID
        const attributeIds = selectedAttributes.value
          .map((item) => item.id)
          .filter((id) => id !== undefined);

        // 调用删除API
        const res = await delAttribute(attributeIds);
        debugLog("删除属性结果=>", res);

        // 处理响应结果
        if (res.code === 200) {
          ElMessage.success(res.msg);
          // 刷新属性列表
          fetchAttributeList();
        } else {
          ElMessage.error(res.msg || "删除失败");
        }
      }
    );
  };
</script>
