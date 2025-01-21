<template>
  <div>
    <!-- 搜索表单 -->
    <el-form :model="queryParams" class="d-flex align-items-center">
      <el-form-item label="公告标题" class="mx-md-2 flex-grow-1">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入公告标题"
          clearable />
      </el-form-item>
      <el-form-item label="状态" class="mx-md-2">
        <el-select
          v-model="queryParams.status"
          placeholder="全选"
          clearable
          style="width: 85px">
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item class="mx-md-2">
        <el-button type="primary" @click="refreshList">搜索</el-button>
      </el-form-item>
      <el-form-item class="mx-md-2">
        <el-button type="primary" @click="toAddBulletin">添加公告</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据展示表格 -->
    <el-table
      ref="bulletinTable"
      :data="bulletinList"
      table-layout="auto"
      cell-class-name="text-center"
      header-cell-class-name="text-center"
      row-key="id"
      class="w-100"
      @selection-change="handleSelectionChange">
      <!-- 添加多选列 -->
      <el-table-column type="selection" width="55" />
      <!-- 公告ID -->
      <el-table-column prop="id" label="ID" />
      <!-- 公告标题 -->
      <el-table-column prop="title" label="公告标题" />
      <!-- 公告图片 -->
      <el-table-column label="图片">
        <template #default="scope">
          <el-image
            v-if="scope.row.imgUrl"
            :src="BASE_URL + scope.row.imgUrl"
            :preview-src-list="[BASE_URL + scope.row.imgUrl]"
            :preview-teleported="true"
            style="width: 106.67px; height: 60px" />
          <span v-else class="text-muted">无图片</span>
        </template>
      </el-table-column>
      <!-- 公告内容 -->
      <el-table-column label="内容">
        <template #default="scope">
          <el-tooltip effect="light" content="点击查看详情">
            <span
              @click="toShowContent(scope.row)"
              class="cursor-pointer text-truncate"
              style="max-width: 500px !important; display: inline-block">
              {{ scope.row.text || "无内容" }}
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <!-- 公告状态 -->
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag :type="scope.row.status === 0 ? 'primary' : 'warning'">
            {{ scope.row.status === 0 ? "有效" : "过期" }}
          </el-tag>
        </template>
      </el-table-column>
      <DataTebleColumnTime />
      <!-- 操作列 -->
      <el-table-column label="操作">
        <template #default="{ row }">
          <div class="d-flex justify-content-around align-items-center">
            <Icon
              icon="icon-bianji"
              class="cursor-pointer"
              @click="toEditBulletin(row)" />
            <Icon
              icon="icon-shanchu"
              class="cursor-pointer text-danger"
              @click="toDelBulletin(row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <CustomPagination
      v-model:current-page="currentPage"
      :total="total"
      @size-change="refreshList"
      @current-change="fetchBulletinList"
      class="mt-3" />
    <!-- 添加/修改弹窗 -->
    <A_EDialog
      v-model:A_EVisible="A_EVisible"
      :A_ETitle="A_ETitle"
      :submitForm="submitForm"
      width="50%">
      <template #headerBtn>
        <span class="ms-2" v-if="!isAdd"
          >ID: {{ A_EFormData && A_EFormData.id }}</span
        >
      </template>
      <el-form
        :model="A_EFormData"
        ref="A_EFormRef"
        label-width="auto"
        :rules="rules"
        v-if="A_EFormData">
        <el-form-item label="公告标题" prop="title">
          <el-input
            v-model="A_EFormData.title"
            placeholder="若无示意图,则直接展示标题"
            clearable />
        </el-form-item>
        <div class="d-flex align-items-center justify-content-between">
          <el-form-item label="公告示意图" prop="imgUrl">
            <el-image
              fit="cover"
              style="width: 177.78px; height: 100px"
              :src="A_EImgUrl"
              :preview-src-list="A_EImgPreviewSrcList"
              :preview-teleported="true"
              class="me-3" />
            <CropperUpload
              ref="cropperUploadRef"
              :uploadApi="allFileUpload"
              v-model:croppedFile="croppedFile"
              :showUploadBtn="false"
              :showClearBtn="!!A_EFormData.imgUrl"
              :aspectRatio="16 / 9"
              @clear="clearImg" />
          </el-form-item>
          <el-form-item label="公告状态" prop="status">
            <el-radio-group v-model="A_EFormData.status">
              <el-radio-button :label="'有效'" :value="0" />
              <el-radio-button :label="'过期'" :value="1" />
            </el-radio-group>
          </el-form-item>
        </div>
        <el-form-item label="公告内容" prop="text">
          <div class="w-100">
            <QuillEditor
              v-model="A_EFormData.text"
              placeholder="请输入小程序公告内容(注意适配手机端屏幕尺寸)" />
          </div>
        </el-form-item>
      </el-form>
    </A_EDialog>
    <!-- 公告展示抽屉 -->
    <el-drawer v-model="drawer" :with-header="false">
      <h2>{{ content.title }}</h2>
      <!-- 图片展示 -->
      <el-image
        v-if="content.imgUrl"
        :src="BASE_URL + content.imgUrl"
        alt="公告示意图片"
        class="mb-3 w-100 rounded" />
      <!-- 富文本内容展示 -->
      <div class="ql-container ql-snow">
        <div class="ql-editor" v-html="content.text" />
      </div>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
  import { reactive, ref, onMounted, computed } from "vue";
  import { ElMessage, FormInstance, TableInstance } from "element-plus";
  import { BulletinItem } from "@/types/wxapp/bulletin";
  import {
    addBulletin,
    delBulletins,
    editBulletin,
    getBulletinList,
  } from "@/api/wxapp/bulletin";
  import { usePaginationStore } from "@/stores/pagination";
  import { cloneDeep } from "lodash";
  import { allFileUpload } from "@/api/upload";
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm";
  import { debugLog } from "@/utils/debug";
  // 查询参数对象
  const queryParams = reactive<BulletinItem>({
    title: "",
    status: undefined,
  });
  const currentPage = ref(1);
  const paginationStore = usePaginationStore();
  const total = ref(0);
  // 公告列表数据
  const bulletinList = ref<BulletinItem[]>([]);

  /**
   * 获取公告列表数据
   * @async
   * @function fetchBulletinList
   */
  const fetchBulletinList = async () => {
    try {
      const res = await getBulletinList({
        pageNum: currentPage.value,
        pageSize: paginationStore.pageSize,
        ...queryParams,
      });
      console.log("公告列表=>", res);
      if (res.code === 200) {
        bulletinList.value = res.rows || [];
        total.value = res.total ?? 0;
      } else ElMessage.error(res.msg || "获取公告列表失败");
    } catch (error) {
      ElMessage.error("网络请求失败");
      console.error("fetchBulletinList Error:", error);
    }
  };
  // 组件挂载时初始化数据
  onMounted(fetchBulletinList);
  const refreshList = () => {
    currentPage.value = 1;
    fetchBulletinList();
  };

  /** API基础URL */
  const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

  /** 添加/修改弹窗可见性 */
  const A_EVisible = ref(false);
  /** 弹窗标题 */
  const A_ETitle = ref("");
  /** 是否为添加操作 */
  const isAdd = ref(true);
  /** 默认表单数据 */
  const defaultForm: BulletinItem = {
    title: "",
    text: "",
    status: 0,
  };
  /** 表单验证规则 */
  const rules = {
    title: [
      { required: true, message: "请输入广告标题", trigger: "blur" },
      { min: 2, max: 30, message: "长度在2-30个字符", trigger: "blur" },
    ],
  };
  /** 表单数据对象 */
  const A_EFormData = reactive(cloneDeep(defaultForm));

  /**
   * 添加广告操作
   * @async
   * @function toAddAd
   */
  const toAddBulletin = async () => {
    A_ETitle.value = "添加小程序公告";
    isAdd.value = true;
    // 获取默认表单的 key 列表
    const defaultKeys = Object.keys(defaultForm);
    // 遍历当前表单数据的 key，删除冗余的 key
    Object.keys(A_EFormData).forEach((key) => {
      if (!defaultKeys.includes(key)) {
        delete A_EFormData[key as keyof BulletinItem];
      }
    });
    Object.assign(A_EFormData, cloneDeep(defaultForm));
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
  };

  /**
   * 修改广告操作
   * @async
   * @function toEditAd
   * @param {BulletinItem} row - 需要修改的广告数据
   */
  const toEditBulletin = async (row: BulletinItem) => {
    A_ETitle.value = "修改小程序公告";
    isAdd.value = false;
    Object.assign(A_EFormData, cloneDeep(row));
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
  };

  /**
   * 清除图片
   * @function clearImg
   */
  const clearImg = () => {
    A_EFormData.imgUrl = "";
  };

  /** 裁剪后的文件 */
  const croppedFile = ref<File>();
  /** 图片URL计算属性 */
  const A_EImgUrl = computed(() =>
    croppedFile.value
      ? URL.createObjectURL(croppedFile.value)
      : BASE_URL + A_EFormData.imgUrl
  );
  /** 图片预览列表计算属性 */
  const A_EImgPreviewSrcList = computed(() =>
    croppedFile.value
      ? [URL.createObjectURL(croppedFile.value)]
      : [BASE_URL + A_EFormData.imgUrl]
  );

  /** 表单引用 */
  const A_EFormRef = ref<FormInstance>();

  /** 图片裁剪组件引用 */
  const cropperUploadRef = ref();
  /**
   * 提交表单
   * @async
   * @function submitForm
   */
  const submitForm = async () => {
    A_EFormRef.value?.validate(async (valid: boolean) => {
      if (!valid) return;
      // 如果有裁剪的图片，先上传图片
      if (croppedFile.value) {
        const { croppedRes } = await cropperUploadRef.value.handleUpload();
        if (!croppedRes || croppedRes.code !== 200) {
          ElMessage.error("图片上传失败");
          return;
        }
        A_EFormData.imgUrl = croppedRes.fileName;
      }
      const apiMethod = isAdd.value ? addBulletin : editBulletin;
      const res = await apiMethod(A_EFormData);
      debugLog(`${A_ETitle.value}=>`, res);
      if (res.code === 200) {
        A_EVisible.value = false;
        ElMessage.success(`${A_ETitle.value}成功`);
        fetchBulletinList(); // 刷新广告列表
      } else ElMessage.error(res.msg || `${A_ETitle.value}失败`);
    });
  };

  // 删除通知/公告--------------
  /** 当前选中的公告列表。*/
  const selectedBulletins = ref<BulletinItem[]>([]);
  /** 表格实例的引用，用于操作表格 */
  const bulletinTable = ref<TableInstance>();
  /**
   * 处理表格行的选择变化
   * @function handleSelectionChange
   * @param {BulletinItem[]} selection - 当前选中的通知/公告列表。
   */
  const handleSelectionChange = (selection: BulletinItem[]) => {
    selectedBulletins.value = selection;
  };

  /**
   * 删除通知/公告
   * @function toDelBulletin
   * @param {BulletinItem} row - 要删除的公告数据。
   */
  const toDelBulletin = (row: BulletinItem) => {
    bulletinTable.value?.toggleRowSelection(row, true);
    elMessageBoxConfirm(
      `删除以下${
        selectedBulletins.value.length
      }个公告 ID: ${selectedBulletins.value.map((i) => i.id)}`,
      async () => {
        const bulletinIds = selectedBulletins.value
          .map((i) => i.id)
          .filter((id) => id !== undefined);
        const res = await delBulletins(bulletinIds);
        debugLog("删除公告=>", res);
        if (res.code === 200) {
          ElMessage.success("删除成功");
          selectedBulletins.value = [];
          refreshList();
        } else ElMessage.error(res.msg || "删除失败");
      }
    );
  };
  /** 抽屉是否打开 */
  const drawer = ref(false);

  /**  当前展示的公告内容*/
  const content = reactive<BulletinItem>({
    title: "",
    text: "",
    imgUrl: "",
  });

  /**
   * 展示公告内容的方法
   * @param {BulletinItem} item - 当前选中的公告数据
   * @description 点击表格内容时触发，将选中的公告内容展示在抽屉中。
   */
  const toShowContent = (item: BulletinItem): void => {
    content.title = item.title;
    content.text = item.text || "暂无详细内容";
    content.imgUrl = item.imgUrl || "";
    drawer.value = true;
  };
</script>
<style lang="scss" scoped>
  @use "quill/dist/quill.snow.css";
</style>
