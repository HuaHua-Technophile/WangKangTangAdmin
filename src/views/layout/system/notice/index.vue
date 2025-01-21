<template>
  <div>
    <!-- 搜索区域 -->
    <el-form :model="queryParams" class="d-flex align-items-center">
      <el-form-item label="通知/公告标题" class="mx-md-2 flex-grow-1">
        <el-input
          v-model="queryParams.noticeTitle"
          placeholder="请输入通知/公告标题"
          clearable />
      </el-form-item>
      <el-form-item label="创建人" class="mx-md-2 flex-grow-1">
        <el-input
          v-model="queryParams.createBy"
          placeholder="请输入创建人"
          clearable />
      </el-form-item>
      <el-form-item label="通知/公告类型" class="mx-md-2">
        <el-select
          v-model="queryParams.noticeType"
          placeholder="全选"
          clearable
          style="width: 100px">
          <el-option
            v-for="option in dictStore.dictData.sys_notice_type"
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
              fetchNoticeList();
            }
          "
          >搜索</el-button
        >
      </el-form-item>
      <el-form-item class="mx-md-2">
        <el-button type="primary" @click="toAddNotice">添加通知/公告</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table
      ref="noticeTable"
      :data="noticeList"
      table-layout="auto"
      cell-class-name="text-center"
      header-cell-class-name="text-center"
      @selection-change="handleSelectionChange"
      :empty-text="'暂时没有通知/公告'">
      <el-table-column type="selection" width="30" />
      <el-table-column prop="noticeId" label="序号" />
      <el-table-column prop="noticeTitle" label="标题" />
      <el-table-column label="通知/公告类型">
        <template #default="{ row }">
          <el-tag
            :type="
              getTagTypeByDictData(
                row.noticeType,
                dictStore.dictData.sys_notice_type
              )
            ">
            {{
              getLabelByDictData(
                row.noticeType,
                dictStore.dictData.sys_notice_type
              )
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template #default="{ row }">
          <el-tag
            :type="
              getTagTypeByDictData(
                row.status,
                dictStore.dictData.sys_notice_status
              )
            ">
            {{
              getLabelByDictData(
                row.status,
                dictStore.dictData.sys_notice_status
              )
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="" label="创建者" />
      <DataTebleColumnTime />
      <el-table-column label="操作">
        <template #default="{ row }">
          <div
            class="d-flex justify-content-around align-items-center"
            v-if="!row.admin">
            <Icon
              icon="icon-bianji"
              class="cursor-pointer"
              @click="toEditNotice(row)" />
            <Icon
              icon="icon-shanchu"
              class="cursor-pointer text-danger"
              @click="toDelNotice(row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <CustomPagination
      v-model:current-page="currentPage"
      :total="total"
      @size-change="refreshList"
      @current-change="fetchNoticeList"
      class="mt-3" />

    <!-- 添加/修改弹窗 -->
    <A_EDialog
      v-model:A_EVisible="A_EVisible"
      :A_ETitle="A_ETitle"
      :submitForm="submitForm"
      :width="'80vw'"
      class="mt-0 mb-0">
      <template #headerBtn>
        <span class="ms-2" v-if="!isAdd"
          >ID:{{ A_EFormData && A_EFormData["noticeId"] }}</span
        >
      </template>
      <el-form
        :model="A_EFormData"
        ref="A_EFormRef"
        label-width="auto"
        :rules="rules"
        v-if="A_EFormData">
        <el-form-item label="标题" prop="noticeTitle">
          <el-input
            v-model="A_EFormData.noticeTitle"
            placeholder="请输入通知/公告标题"
            clearable />
        </el-form-item>
        <div class="d-flex align-items-center justify-content-between">
          <el-form-item label="类型" prop="noticeType">
            <el-radio-group v-model="A_EFormData.noticeType">
              <el-radio-button
                v-for="i in dictStore.dictData.sys_notice_type"
                :value="i.dictValue"
                >{{ i.dictLabel }}</el-radio-button
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="A_EFormData.status">
              <el-radio-button
                v-for="i in dictStore.dictData.sys_notice_status"
                :value="i.dictValue"
                >{{ i.dictLabel }}</el-radio-button
              >
            </el-radio-group>
          </el-form-item>
        </div>
        <el-form-item label="内容" prop="noticeContent">
          <div class="w-100">
            <QuillEditor
              v-model="A_EFormData.noticeContent"
              placeholder="请输入通知/公告内容" />
          </div>
        </el-form-item>
      </el-form>
    </A_EDialog>
  </div>
</template>
<script lang="ts" setup>
  /**
   * @file notice-management.vue
   * @description 通知/公告管理模块，提供通知/公告的查询、添加、编辑和删除功能。
   * 使用 Vue 3 组合式 API 编写，集成 Element Plus 组件库。
   */

  import { ref, reactive, onMounted, onBeforeMount } from "vue";
  import { useDictStore } from "@/stores/dictData";
  import { usePaginationStore } from "@/stores/pagination";
  import {
    addNotice,
    delNotices,
    editNotice,
    getNoticeList,
  } from "@/api/system/notice";
  import { ElMessage, FormRules, TableInstance } from "element-plus";
  import { NoticeItem } from "@/types/system/notice";
  import {
    getTagTypeByDictData,
    getLabelByDictData,
  } from "@/utils/system/dict/dictDataToOptions";
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm";
  import { debugLog } from "@/utils/debug";
  import { cloneDeep } from "lodash";
  import { AxiosResponse } from "axios";

  // 字典数据------------------
  /**
   * @const {ReturnType<typeof useDictStore>} dictStore - 字典数据存储，用于获取通知类型和状态的字典数据。
   */
  const dictStore = useDictStore();
  onBeforeMount(() => {
    dictStore.fetchDictData("sys_notice_type", "sys_notice_status");
  });

  // 请求参数设置------------
  /**
   * @const {ReactiveObject} queryParams - 查询参数，包括通知标题、创建人和通知类型。
   */
  const queryParams = reactive<
    Pick<NoticeItem, "noticeTitle" | "createBy" | "noticeType">
  >({});

  /**
   * @const {Ref<NoticeItem[]>} noticeList - 通知/公告列表数据。
   */
  const noticeList = ref<NoticeItem[]>([]);

  /**
   * @const {Ref<number>} total - 通知/公告总数。
   */
  const total = ref(0);

  /**
   * @const {ReturnType<typeof usePaginationStore>} paginationStore - 分页数据存储。
   */
  const paginationStore = usePaginationStore();

  /**
   * @const {Ref<number>} currentPage - 当前页码。
   */
  const currentPage = ref(1);

  /**
   * 查询通知/公告列表
   * @async
   * @function fetchNoticeList
   */
  const fetchNoticeList = async () => {
    const res = await getNoticeList({
      pageNum: currentPage.value,
      pageSize: paginationStore.pageSize,
      ...queryParams,
    });
    debugLog("通知/公告列表=>", res);
    if (res.rows && res.total !== undefined) {
      noticeList.value = res.rows;
      total.value = res.total;
    } else ElMessage.error(res.msg || "获取通知/公告列表失败");
  };

  /**
   * 初始化时加载通知/公告列表
   */
  onMounted(fetchNoticeList);

  /**
   * 刷新通知/公告列表
   * @function refreshList
   */
  const refreshList = () => {
    currentPage.value = 1;
    fetchNoticeList();
  };

  // 添加/修改通知/公告表单----------------
  /** 当前操作是否为新增。*/
  const isAdd = ref(true);

  /** 添加/编辑对话框的显示状态。*/
  const A_EVisible = ref(false);

  /** 添加/编辑对话框的标题。*/
  const A_ETitle = ref("");

  /** 添加/编辑表单的默认数据。*/
  const defaultForm: NoticeItem = {
    noticeTitle: "",
    noticeType: "",
    noticeContent: "",
    status: "",
  };

  /** 添加/编辑表单数据。*/
  let A_EFormData: NoticeItem;

  /** 当前操作的请求函数（新增或编辑）。*/
  let A_EFun: (data: NoticeItem) => Promise<AxiosResponse>;

  /** 表单验证规则。 */
  const rules: FormRules = {
    noticeTitle: [
      { required: true, message: "请输入通知/公告标题", trigger: "blur" },
      { max: 50, message: "通知/公告标题最多50个字符", trigger: "blur" },
    ],
    noticeType: [
      { required: true, message: "请选择通知/公告类型", trigger: "blur" },
    ],
    noticeContent: [
      { required: true, message: "请输入通知/公告内容", trigger: "blur" },
    ],
    status: [{ required: true, message: "请选择状态", trigger: "blur" }],
  };

  // 提交表单-----------------
  /** 表单的引用，用于操作表单实例。 */
  const A_EFormRef = ref();

  /**
   * 提交表单
   * @async
   * @function submitForm
   */
  const submitForm = async () => {
    A_EFormRef.value?.validate(async (valid: boolean) => {
      if (!valid) return;
      const res = await A_EFun(A_EFormData);
      debugLog(`${A_ETitle.value}结果=>`, res);
      if (res.code === 200) {
        ElMessage.success(`${A_ETitle.value}成功`);
        A_EVisible.value = false;
        fetchNoticeList();
      } else ElMessage.error(res.msg || `${A_ETitle.value}失败`);
    });
  };

  // 打开新增通知/公告对话框-----------
  /**
   * 打开新增通知/公告对话框
   * @function toAddNotice
   */
  const toAddNotice = () => {
    A_ETitle.value = "新增通知/公告";
    isAdd.value = true;
    A_EFun = addNotice;
    A_EFormData = reactive(cloneDeep(defaultForm));
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
  };

  // 打开编辑通知/公告对话框-------------
  /**
   * 打开编辑通知/公告对话框
   * @function toEditNotice
   * @param {NoticeItem} row - 当前选中的通知/公告数据。
   */
  const toEditNotice = (row: NoticeItem) => {
    A_ETitle.value = "修改通知/公告";
    isAdd.value = false;
    A_EFun = editNotice;
    A_EFormData = reactive({
      noticeId: row.noticeId,
      noticeTitle: row.noticeTitle,
      noticeType: row.noticeType,
      noticeContent: row.noticeContent,
      status: row.status,
    });
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
  };

  // 删除通知/公告--------------
  /** 当前选中的通知/公告列表。*/
  const selectedNotices = ref<NoticeItem[]>([]);

  /** 表格实例的引用，用于操作表格 */
  const noticeTable = ref<TableInstance>();

  /**
   * 处理表格行的选择变化
   * @function handleSelectionChange
   * @param {NoticeItem[]} selection - 当前选中的通知/公告列表。
   */
  const handleSelectionChange = (selection: NoticeItem[]) => {
    selectedNotices.value = selection;
  };

  /**
   * 删除通知/公告
   * @function toDelNotice
   * @param {NoticeItem} row - 要删除的通知/公告数据。
   */
  const toDelNotice = (row: NoticeItem) => {
    noticeTable.value?.toggleRowSelection(row, true);
    elMessageBoxConfirm(
      `删除以下${
        selectedNotices.value.length
      }个通知/公告 ID: ${selectedNotices.value.map((i) => i.noticeId)}`,
      async () => {
        const noticeIds = selectedNotices.value
          .map((i) => i.noticeId)
          .filter((id) => id !== undefined);
        const res = await delNotices(noticeIds);
        debugLog("删除通知/公告=>", res);
        if (res.code === 200) {
          ElMessage.success("删除成功");
          selectedNotices.value = [];
          refreshList();
        } else ElMessage.error(res.msg || "删除失败");
      }
    );
  };
</script>
