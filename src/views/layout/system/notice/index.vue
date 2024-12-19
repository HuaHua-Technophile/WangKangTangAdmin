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
      @size-change="fetchNoticeList"
      @current-change="fetchNoticeList"
      class="mt-3" />

    <!-- 添加/修改通知/公告 -->
    <A_EDialog
      v-model:A_EVisible="A_EVisible"
      :A_ETitle="A_ETitle"
      :submitForm="submitForm"
      :width="'80vw'"
      class="mt-0 mb-0">
      <template #headerBtn>
        <span class="ms-2" v-if="!isAdd"
          >ID:{{ A_EForm && A_EForm["noticeId"] }}</span
        >
      </template>
      <el-form
        :model="A_EForm"
        ref="A_EFormRef"
        label-width="auto"
        :rules="rules"
        v-if="A_EForm">
        <el-form-item label="标题" prop="noticeTitle">
          <el-input
            v-model="A_EForm.noticeTitle"
            placeholder="请输入通知/公告标题"
            clearable />
        </el-form-item>
        <div class="d-flex align-items-center justify-content-between">
          <el-form-item label="类型" prop="noticeType">
            <el-radio-group v-model="A_EForm.noticeType">
              <el-radio-button
                v-for="i in dictStore.dictData.sys_notice_type"
                :value="i.dictValue"
                >{{ i.dictLabel }}</el-radio-button
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="A_EForm.status">
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
              v-model="A_EForm.noticeContent"
              placeholder="请输入通知/公告内容" />
          </div>
        </el-form-item>
      </el-form>
    </A_EDialog>
  </div>
</template>
<script lang="ts" setup>
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
  } from "@/utils/dictDataToOptions";
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm";
  import { debugLog } from "@/utils/debug";
  import { cloneDeep } from "lodash";
  import { AxiosResponse } from "axios";
  // 字典数据------------------
  const dictStore = useDictStore();
  onBeforeMount(() => {
    dictStore.fetchDictData("sys_notice_type", "sys_notice_status");
  });

  // 请求参数设置------------
  const queryParams = reactive<
    Pick<NoticeItem, "noticeTitle" | "createBy" | "noticeType">
  >({});
  const noticeList = ref<NoticeItem[]>([]);
  const total = ref(0);
  const paginationStore = usePaginationStore();
  const currentPage = ref(1);

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
  onMounted(fetchNoticeList);

  // 添加/修改通知/公告表单----------------
  const isAdd = ref(true);
  const A_EVisible = ref(false);
  const A_ETitle = ref("");
  const defaultForm: NoticeItem = {
    noticeTitle: "",
    noticeType: "",
    noticeContent: "",
    status: "",
  };
  let A_EForm: NoticeItem;
  let A_EFun: (data: NoticeItem) => Promise<AxiosResponse>;
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
  const A_EFormRef = ref();
  const submitForm = async () => {
    A_EFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        const res = await A_EFun(A_EForm);
        debugLog(`${A_ETitle.value}结果=>`, res);
        if (res.code === 200) {
          ElMessage.success(`${A_ETitle.value}成功`);
          A_EVisible.value = false;
          fetchNoticeList();
        } else ElMessage.error(res.msg || `${A_ETitle.value}失败`);
      }
    });
  };

  // 打开新增通知/公告对话框-----------
  const toAddNotice = () => {
    A_ETitle.value = "新增通知/公告";
    isAdd.value = true;
    A_EFun = addNotice;
    A_EForm = reactive(cloneDeep(defaultForm));
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
  };

  // 打开编辑通知/公告对话框-------------
  const toEditNotice = (row: NoticeItem) => {
    A_ETitle.value = "修改通知/公告";
    isAdd.value = false;
    A_EFun = editNotice;
    A_EForm = reactive({
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
  const selectedNotices = ref<NoticeItem[]>([]);
  const noticeTable = ref<TableInstance>();
  const handleSelectionChange = (selection: NoticeItem[]) => {
    selectedNotices.value = selection;
  };
  const toDelNotice = (row: NoticeItem) => {
    // 勾选被点击的行
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
          fetchNoticeList();
        } else ElMessage.error(res.msg || "删除失败");
      }
    );
  };
</script>
