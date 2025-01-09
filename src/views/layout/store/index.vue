<template>
  <div>
    <!-- 搜索表单 -->
    <el-form
      :model="queryParams"
      class="flex-grow-1 d-flex justify-content-between align-items-center">
      <el-form-item label="店铺名称" class="mx-md-2 flex-grow-1">
        <el-input
          v-model="queryParams.storeName"
          placeholder="请输入店铺名称"
          clearable />
      </el-form-item>
      <el-form-item label="电话" class="mx-md-2">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入联系电话"
          clearable />
      </el-form-item>
      <el-form-item label="状态" class="mx-md-2">
        <el-select
          v-model="queryParams.status"
          placeholder="全选"
          clearable
          style="width: 100px">
          <el-option :label="'禁用'" :value="0" />
          <el-option :label="'启用'" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item class="mx-md-2">
        <el-button type="primary" @click="fetchStoreList">搜索</el-button>
      </el-form-item>
      <el-form-item class="mx-md-2">
        <el-button type="primary" @click="toAddStore">添加店铺</el-button>
      </el-form-item>
    </el-form>
    <!-- 展示表单 -->
    <el-table
      ref="storeTable"
      :data="storeList"
      table-layout="auto"
      cell-class-name="text-center"
      header-cell-class-name="text-center">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="storeName" label="店铺名称" />
      <el-table-column prop="address" label="地址">
        <template #default="{ row }">
          <el-tooltip
            effect="light"
            placement="top"
            :content="row.address"
            v-if="row.address">
            <el-text style="max-width: 150px" truncated>
              {{ row.address }}
            </el-text>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="businessHours" label="营业时间">
        <template #default="{ row }">
          {{ row.businessHours || "暂未设置" }}
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="联系电话" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'primary' : 'danger'">
            {{ row.status === 1 ? "启用" : "禁用" }}
          </el-tag>
        </template>
      </el-table-column>
      <DataTebleColumnTime />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <div class="d-flex justify-content-around align-items-center">
            <Icon
              icon="icon-bianji"
              class="cursor-pointer"
              @click="toEditStore(row)" />
            <Icon
              icon="icon-shanchu"
              class="cursor-pointer text-danger"
              @click="toDelStore(row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加/编辑表单 -->
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
        <el-form-item label="店铺名称" prop="storeName">
          <el-input
            v-model="A_EFormData.storeName"
            placeholder="请输入店铺名称"
            clearable />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input
            v-model="A_EFormData.phone"
            placeholder="请输入联系电话"
            maxlength="11"
            clearable />
        </el-form-item>
        <el-form-item label="店铺地址" prop="address">
          <el-input
            v-model="A_EFormData.address"
            placeholder="请输入店铺地址"
            maxlength="100"
            clearable />
        </el-form-item>
        <el-form-item label="营业时间" prop="businessHours">
          <el-time-picker
            v-model="A_EFormData.businessHours"
            is-range
            range-separator="至"
            start-placeholder="开店时间"
            end-placeholder="闭店时间"
            value-format="HH:mm"
            format="HH:mm" />
        </el-form-item>
        <el-form-item label="开启店铺" prop="status">
          <el-switch
            v-model="A_EFormData.status"
            :active-value="1"
            :inactive-value="0" />
        </el-form-item>
      </el-form>
    </A_EDialog>
  </div>
</template>
<script lang="ts" setup>
  import {
    addStore,
    delStore,
    editStore,
    getStoreList,
  } from "@/api/store/store";
  import { StoreItem } from "@/types/store/store";
  import { debugLog } from "@/utils/debug";
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm";
  import { AxiosResponse } from "axios";
  import { ElMessage, FormInstance, FormRules } from "element-plus";
  import { cloneDeep } from "lodash";
  import { onMounted, reactive, ref } from "vue";

  /**
   * 查询参数对象
   */
  const queryParams = reactive<StoreItem>({
    storeName: "",
    phone: "",
  });

  /**
   * 店铺列表数据
   */
  const storeList = ref<StoreItem[]>();

  /**
   * 获取店铺列表数据
   * @async
   * @function fetchStoreList
   */
  const fetchStoreList = async () => {
    const res = await getStoreList(queryParams);
    debugLog("获取分店列表=>", res);
    if (res.code == 200) storeList.value = res.data;
    else ElMessage.error(res.msg || "获取店铺列表失败");
  };
  onMounted(fetchStoreList);

  // 表单相关状态--------------------------------------
  /**
   * 是否为添加操作的标志
   */
  const isAdd = ref(true);

  /**
   * 添加/编辑对话框可见性
   */
  const A_EVisible = ref(false);

  /**
   * 添加/编辑对话框标题
   */
  const A_ETitle = ref("");

  /**
   * 默认表单数据
   * @type {StoreItem}
   */
  const defaultForm: StoreItem = {
    storeName: "",
    phone: "",
    address: "",
    businessHours: "",
    status: 1,
  };
  /**
   * 当前编辑的表单数据
   * @type {StoreItem}
   */
  let A_EFormData: StoreItem;

  /**
   * 当前使用的API函数
   * @type {Function}
   */
  let A_EFun: (data: StoreItem) => Promise<AxiosResponse>;

  /**
   * 表单验证规则
   * @type {FormRules}
   */
  const rules: FormRules = {
    storeName: [
      { required: true, message: "请输入店铺名称", trigger: "blur" },
      { min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
    ],
    phone: [
      { required: true, message: "请输入联系电话", trigger: "blur" },
      {
        pattern: /(^1[3-9]\d{9}$)|(^\d{7}$)/,
        message: "请输入正确的手机号码或座机号码",
        trigger: "blur",
      },
    ],
    address: [{ required: true, message: "请输入店铺地址", trigger: "blur" }],
  };
  // 提交表单-------------------------------
  /**
   * 表单引用
   */
  const A_EFormRef = ref<FormInstance>();
  /**
   * 提交表单
   * @async
   * @function submitForm
   */
  const submitForm = async () => {
    A_EFormRef.value?.validate(async (valid: boolean) => {
      if (!valid) return;
      const res = await A_EFun({
        ...A_EFormData,
        // 如果是数组，则转换为字符串
        businessHours: Array.isArray(A_EFormData.businessHours)
          ? A_EFormData.businessHours.join("-")
          : A_EFormData.businessHours,
      });
      debugLog(`${A_ETitle.value}结果=>`, res);
      if (res.code === 200) {
        ElMessage.success(`${A_ETitle.value}成功`);
        A_EVisible.value = false;
        fetchStoreList();
      } else ElMessage.error(res.msg || `${A_ETitle.value}失败`);
    });
  };

  // 添加店铺----------------------------
  /**
   * 打开添加店铺对话框
   * @function toAddStore
   */
  const toAddStore = () => {
    A_ETitle.value = "添加店铺";
    isAdd.value = true;
    A_EFun = addStore; // 需要您提供对应的API函数
    A_EFormData = reactive(cloneDeep(defaultForm));
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
  };

  // 修改店铺-----------------------------
  /**
   * 打开编辑店铺对话框
   * @function toEditStore
   * @param {StoreItem} data - 要编辑的店铺数据
   */
  const toEditStore = (data: StoreItem) => {
    A_ETitle.value = "修改店铺";
    isAdd.value = false;
    A_EFun = editStore; // 需要您提供对应的API函数

    // 只提取需要的属性
    A_EFormData = reactive({
      id: data.id,
      storeName: data.storeName,
      phone: data.phone,
      address: data.address,
      businessHours:
        typeof data.businessHours === "string"
          ? data.businessHours.split("-")
          : [],
      status: data.status,
    });
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
  };

  // 删除店铺----------------------------
  /**
   * 删除店铺
   * @function toDelStore
   * @param {StoreItem} data - 要删除的店铺数据
   */
  const toDelStore = (data: StoreItem) => {
    elMessageBoxConfirm(`删除店铺：${data.storeName}`, async () => {
      const res = await delStore(data.id!);
      debugLog("删除店铺结果=>", res);
      if (res.code === 200) {
        ElMessage.success("删除成功");
        fetchStoreList(); // 重新获取数据
      } else ElMessage.error(res.msg || "删除失败");
    });
  };
</script>
