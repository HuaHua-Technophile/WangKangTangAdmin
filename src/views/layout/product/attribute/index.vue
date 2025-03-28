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
      @size-change="refreshList"
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

  /**
   * @typedef {Object} AttributeItem 商品属性项接口
   * @property {number} productAttributeCategoryId 属性分类ID
   * @property {0 | 1} type 属性类型(0:规格 1:参数)
   * @property {string} name 属性名称
   * @property {number} selectType 选择类型(0:唯一 1:单选 2:多选)
   * @property {number} inputType 录入方式(0:手工录入 1:列表选择)
   * @property {string} inputList 可选值列表
   * @property {number} sort 排序值
   * @property {0 | 1} relatedStatus 药品属性关联状态
   * @property {0 | 1} handAddStatus 是否支持手动新增
   */

  // 验证路由参数-----------------------------------
  useRouteParamsValidation({
    requiredParams: ["cid", "type", "father"],
  });
  const route = useRoute();
  const router = useRouter();

  /**
   * 表格数据相关的响应式引用
   */
  const attributeList = ref<AttributeItem[]>([]);
  const currentPage = ref(1);
  const total = ref(0);
  const paginationStore = usePaginationStore();
  /**
   * 查询参数 - 属性类型(0:规格 1:参数)
   */
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
  /**
   * 处理属性类型切换 */
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
  const refreshList = () => {
    currentPage.value = 1;
    fetchAttributeList();
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

  /**
   * 表单相关的响应式状态
   */
  const isAdd = ref(true);
  const A_EVisible = ref(false);
  const A_ETitle = ref("");
  const A_EFormData = reactive(cloneDeep(defaultForm));

  /**
   * 计算属性：inputList字符串与数组的转换
   */
  const inputListArray = computed({
    get: () => (A_EFormData.inputList ? A_EFormData.inputList.split(",") : []),
    set: (newValue: string[]) => {
      A_EFormData.inputList = newValue.join(",");
    },
  });
  /**
   * 表单验证规则
   * @type {FormRules}
   */
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

  /**
   * 表单提交处理
   * @async
   * @returns {Promise<void>}
   */
  const A_EFormRef = ref<FormInstance>();
  const submitForm = async () => {
    A_EFormRef.value?.validate(async (valid: boolean) => {
      if (!valid) return;
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
    });
  };
  /**
   * 添加属性处理
   * @returns {void}
   */
  const toAddAttribute = () => {
    isAdd.value = true;
    A_ETitle.value = type.value == 0 ? "添加规格" : "添加参数";

    // 获取默认表单的 key 列表
    const defaultKeys = Object.keys(defaultForm);
    // 遍历当前表单数据的 key，删除冗余的 key
    Object.keys(A_EFormData).forEach((key) => {
      if (!defaultKeys.includes(key)) {
        delete A_EFormData[key as keyof AttributeItem];
      }
    });
    // 使用默认表单值重置数据
    Object.assign(A_EFormData, {
      ...defaultForm,
      productAttributeCategoryId: Number(route.query.cid),
    });
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
  };
  /**
   * 修改属性处理
   * @param {AttributeItem} data - 要修改的属性数据
   */
  const toEditAttribute = (data: AttributeItem) => {
    A_ETitle.value = type.value == 0 ? "修改规格" : "修改参数";
    isAdd.value = false;
    Object.assign(A_EFormData, data);
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
  };

  /**
   * 选中的属性数组和表格引用
   */
  const selectedAttributes = ref<AttributeItem[]>([]);
  const attributeTable = ref<TableInstance>();
  /**
   * 处理表格选择变化
   * @param {AttributeItem[]} selection - 选中的行数据数组
   */
  const handleAttributeSelectionChange = (selection: AttributeItem[]) => {
    selectedAttributes.value = selection;
  };
  /**
   * 删除属性处理
   * @param {AttributeItem} row - 要删除的属性行数据
   */
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
