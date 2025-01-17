<template>
  <div>
    <!-- 搜索表单 -->
    <el-form :model="queryParams" class="d-flex align-items-center flex-wrap">
      <el-form-item label="广告名称" class="mx-md-2 flex-grow-1">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入广告名称"
          clearable />
      </el-form-item>
      <el-form-item label="开始时间" class="mx-md-2">
        <el-date-picker
          v-model="queryParams.startTime"
          type="datetime"
          placeholder="选择开始时间"
          clearable />
      </el-form-item>
      <el-form-item label="结束时间" class="mx-md-2">
        <el-date-picker
          v-model="queryParams.endTime"
          type="datetime"
          placeholder="选择结束时间"
          clearable />
      </el-form-item>
      <el-form-item label="状态" class="mx-md-2">
        <el-select
          v-model="queryParams.status"
          placeholder="全选"
          clearable
          style="width: 100px">
          <el-option :value="1" label="上线" />
          <el-option :value="0" label="下线" />
        </el-select>
      </el-form-item>
      <el-form-item class="mx-md-2">
        <el-button type="primary" @click="refreshList">搜索</el-button>
      </el-form-item>
      <el-form-item class="mx-md-2">
        <el-button type="primary" @click="toAddAdvertise"> 添加广告 </el-button>
      </el-form-item>
    </el-form>
    <!-- 数据展示表格 -->
    <el-table
      ref="advertiseTable"
      :data="advertiseList"
      table-layout="auto"
      cell-class-name="text-center"
      header-cell-class-name="text-center"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="30" />
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="name" label="轮播图名称" />
      <el-table-column label="轮播图片">
        <template #default="scope">
          <el-image
            v-if="scope.row.pic"
            :src="BASEURL + scope.row.pic"
            :preview-src-list="[BASEURL + scope.row.pic]"
            :preview-teleported="true"
            style="width: 60px; height: 60px; object-fit: cover" />
        </template>
      </el-table-column>
      <el-table-column prop="url" label="链接商品ID" />
      <el-table-column prop="startTime" label="开始时间">
        <template #default="{ row }">{{
          formatToReadableDate(row.startTime)
        }}</template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间">
        <template #default="{ row }">{{
          formatToReadableDate(row.endTime)
        }}</template>
      </el-table-column>
      <el-table-column label="下单/点击数">
        <template #default="{ row }">
          {{ row.orderCount || 0 }}/{{ row.clickCount || 0 }}
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" />
      <el-table-column label="状态">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <div class="d-flex justify-content-around align-items-center">
            <Icon
              icon="icon-bianji"
              class="cursor-pointer"
              @click="toEditAdvertise(row)" />
            <Icon
              icon="icon-shanchu"
              class="cursor-pointer text-danger"
              @click="toDelAdvertise(row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <CustomPagination
      v-model:current-page="currentPage"
      :total="total"
      @size-change="refreshList"
      @current-change="fetchAdvertiseList"
      class="mt-3" />
    <!-- 添加/修改弹窗 -->
    <A_EDialog
      v-model:A_EVisible="A_EVisible"
      :A_ETitle="A_ETitle"
      :submitForm="submitForm">
      <template #headerBtn>
        <span class="ms-2" v-if="!isAdd">
          ID: {{ A_EFormData && A_EFormData.id }}
        </span>
      </template>
      <el-form
        :model="A_EFormData"
        ref="A_EFormRef"
        label-width="auto"
        :rules="rules"
        v-if="A_EFormData">
        <el-form-item label="生效时间" prop="timeRange">
          <el-date-picker
            v-model="timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD HH:mm:ss"
            @change="handleTimeRangeChange" />
        </el-form-item>
        <el-form-item label="轮播图名称" prop="name">
          <el-input v-model="A_EFormData.name" />
        </el-form-item>
        <el-form-item label="轮播图" prop="pic">
          <el-image
            fit="cover"
            style="width: 125px; height: 125px"
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
            @clear="clearImg" />
        </el-form-item>
        <el-form-item label="商品ID" prop="url">
          <el-input-number v-model="A_EFormData.url" :min="0" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="A_EFormData.sort" :min="0" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="A_EFormData.status">
            <el-radio-button :value="0">下线</el-radio-button>
            <el-radio-button :value="1">上线</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input v-model="A_EFormData.note" type="textarea" />
        </el-form-item>
      </el-form>
    </A_EDialog>
  </div>
</template>
<script lang="ts" setup>
  import {
    addAdvertise,
    delAdvertise,
    editAdvertise,
    editAdvertiseStatus,
    getAdvertiseList,
  } from "@/api/ad/advertise";
  import { allFileUpload } from "@/api/upload";
  import { usePaginationStore } from "@/stores/pagination";
  import { AdvertiseItem } from "@/types/ad/advertise";
  import { debugLog } from "@/utils/debug";
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm";
  import { formatToReadableDate } from "@/utils/formatToReadableDate";
  import {
    ElMessage,
    FormInstance,
    FormRules,
    TableInstance,
  } from "element-plus";
  import { cloneDeep } from "lodash";
  import { computed, onMounted, reactive, ref } from "vue";

  // 数据查询------------------------------
  /**
   * 广告列表查询参数
   */
  const queryParams = reactive<
    Pick<AdvertiseItem, "name" | "status" | "startTime" | "endTime">
  >({
    name: "",
    status: undefined,
    startTime: "",
    endTime: "",
  });
  /** 当前页码 */
  const currentPage = ref(1);
  /** 总记录数 */
  const total = ref(0);
  const paginationStore = usePaginationStore();
  /** 广告列表数据 */
  const advertiseList = ref<AdvertiseItem[]>([]);
  /**
   * 获取广告列表
   * @description 根据查询参数获取广告列表数据
   */
  const fetchAdvertiseList = async () => {
    try {
      const res = await getAdvertiseList({
        pageNum: currentPage.value,
        pageSize: paginationStore.pageSize, // 可以从分页 store 获取
        ...queryParams,
      });
      debugLog("查询广告列表结果=>", res);
      if (res.code === 200) {
        advertiseList.value = res.rows || [];
        total.value = res.total || 0;
      } else ElMessage.error(res.msg || "获取广告列表失败");
    } catch (error) {
      ElMessage.error("网络请求失败");
      console.error(error);
    }
  };
  /**
   * 处理搜索操作
   * @description 重置页码并获取列表数据
   */
  const refreshList = () => {
    currentPage.value = 1;
    fetchAdvertiseList();
  };
  onMounted(fetchAdvertiseList);
  // 数据展示------------------------------
  const BASEURL = import.meta.env.VITE_APP_API_BASE_URL;
  // 状态变更处理方法
  const handleStatusChange = async (row: AdvertiseItem) => {
    try {
      // 调用修改状态的API
      if (row.id !== undefined) {
        const res = await editAdvertiseStatus(row.id, row.status ?? 0); // Default to 0 if undefined
        if (res.code === 200)
          // 可选：添加成功提示
          ElMessage.success(
            `轮播图"${row.name}"状态已更新为${
              row.status === 1 ? "上线" : "下线"
            }`
          );
      } else {
        ElMessage.error("广告ID未定义");
      }
    } catch (error) {
      // 发生错误时，需要还原状态
      row.status = row.status === 1 ? 0 : 1;
      // 错误提示
      ElMessage.error("状态更新失败，请重试");
    }
  };

  // 添加/修改弹窗---------------------------------
  const A_EFormRef = ref<FormInstance>();
  const A_EVisible = ref(false);
  const A_ETitle = ref("");
  const isAdd = ref(true);
  const defaultForm: AdvertiseItem = {
    name: "",
    pic: "",
    startTime: "",
    endTime: "",
    status: 1,
    sort: 0,
    note: "",
  };
  const A_EFormData = reactive<AdvertiseItem>(cloneDeep(defaultForm));
  const rules: FormRules = {
    name: [
      { required: true, message: "请输入轮播图名称", trigger: "blur" },
      { min: 2, max: 20, message: "长度在2-20个字符", trigger: "blur" },
    ],
    pic: [
      {
        required: true,
        validator: (_rule: any, _value: any, callback: any) => {
          if (!croppedFile.value && !A_EFormData.pic) {
            callback(new Error("请上传轮播图"));
          } else callback();
        },
        trigger: "change",
      },
    ],
    url: [{ required: true, message: "请输入链接的商品ID", trigger: "blur" }],
  };

  // 表单内选项
  const timeRange = ref<[string, string]>(["", ""]);
  const croppedFile = ref<File>();
  const showClearBtn = computed(() => {
    return !A_EFormData.pic && A_EFormData.pic != "" && !croppedFile.value;
  });
  const handleTimeRangeChange = (val: [string, string]) => {
    A_EFormData.startTime = val[0];
    A_EFormData.endTime = val[1];
  };
  const toAddAdvertise = async () => {
    A_ETitle.value = "添加轮播图";
    isAdd.value = true;
    Object.assign(A_EFormData, defaultForm);
    timeRange.value = ["", ""];
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
  };
  const toEditAdvertise = async (row: AdvertiseItem) => {
    A_ETitle.value = "修改轮播图";
    isAdd.value = false;
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
    Object.assign(A_EFormData, row);
    timeRange.value = [row.startTime, row.endTime];
  };
  const clearImg = () => {
    A_EFormData.pic = "";
  };

  // 提交表单-------------------------------
  /** 图片URL计算属性 */
  const A_EImgUrl = computed(() =>
    croppedFile.value
      ? URL.createObjectURL(croppedFile.value)
      : BASEURL + A_EFormData.pic
  );
  /** 图片预览列表计算属性 */
  const A_EImgPreviewSrcList = computed(() =>
    croppedFile.value
      ? [URL.createObjectURL(croppedFile.value)]
      : [BASEURL + A_EFormData.pic]
  );

  // 提交表单---------------------
  /** 图片裁剪组件引用 */
  const cropperUploadRef = ref();
  /**
   * 提交表单
   * @async
   * @function submitForm
   */
  const submitForm = () => {
    A_EFormRef.value?.validate(async (valid: boolean) => {
      if (!valid) return;
      // 如果有裁剪的图片，先上传图片
      if (croppedFile.value) {
        const { croppedRes } = await cropperUploadRef.value.handleUpload();

        if (!croppedRes || croppedRes.code !== 200) {
          ElMessage.error("图片上传失败");
          return;
        }
        // 更新表单数据中的图片URL
        A_EFormData.pic = croppedRes.fileName;
      }
      const apiMethod = isAdd.value ? addAdvertise : editAdvertise;
      const res = await apiMethod(A_EFormData);
      debugLog(`${A_ETitle.value}结果=>`, res);

      if (res.code === 200) {
        A_EVisible.value = false;
        ElMessage.success(`${A_ETitle.value}成功`);
        fetchAdvertiseList(); // 刷新列表
      } else ElMessage.error(res.msg || `${A_ETitle.value}失败`);
    });
  };

  // 删除数据--------------------------------
  /** 选中的轮播图列表 */
  const selectedAdvertises = ref<AdvertiseItem[]>([]);
  /** 表格实例引用 */
  const advertiseTable = ref<TableInstance>();
  /**
   * 处理轮播图表格多选变化
   * @function handleSelectionChange
   * @param {AdvertiseItem[]} selection - 选中的行数据数组
   */
  const handleSelectionChange = (selection: AdvertiseItem[]) => {
    selectedAdvertises.value = selection;
  };
  /**
   * 删除轮播图
   * @async
   * @function toDelAdvertise
   * @param {AdvertiseItem} row - 需要删除的轮播图数据
   */
  const toDelAdvertise = (row: AdvertiseItem) => {
    // 勾选被点击的行
    advertiseTable.value?.toggleRowSelection(row, true);

    elMessageBoxConfirm(
      `删除以下${
        selectedAdvertises.value.length
      }个轮播图 ID: ${selectedAdvertises.value.map((i) => i.id)}`,
      async () => {
        const advertiseIds = selectedAdvertises.value
          .map((i) => i.id)
          .filter((id) => id !== undefined);

        const res = await delAdvertise(advertiseIds);
        debugLog("删除轮播图=>", res);
        if (res.code === 200) {
          ElMessage.success("删除成功");
          selectedAdvertises.value = [];
          fetchAdvertiseList(); // 重新获取轮播图列表
        } else ElMessage.error(res.msg || "删除失败");
      }
    );
  };
</script>
