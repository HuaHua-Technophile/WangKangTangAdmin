<template>
  <div>
    <el-button @click="toAddAptitude">添加小程序资质图片</el-button>
    <!-- 数据展示表格 -->
    <el-table
      ref="aptitudeTable"
      :data="aptitudeList"
      table-layout="auto"
      cell-class-name="text-center"
      header-cell-class-name="text-center"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="30" />
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="sort" label="排序" />
      <el-table-column prop="image" label="小程序资质图片">
        <template #default="scope">
          <el-image
            v-if="scope.row.image"
            :src="BASEURL + scope.row.image"
            fit="cover"
            :preview-src-list="[BASEURL + scope.row.image]"
            :preview-teleported="true"
            style="width: 50px; height: 50px" />
        </template>
      </el-table-column>
      <DataTebleColumnTime />
      <el-table-column label="操作">
        <template #default="{ row }">
          <div class="d-flex justify-content-around align-items-center">
            <Icon
              icon="icon-bianji"
              class="cursor-pointer"
              @click="toEditAptitude(row)" />
            <Icon
              icon="icon-shanchu"
              class="cursor-pointer text-danger"
              @click="toDelAptitude(row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <CustomPagination
      v-model:current-page="currentPage"
      :total="total"
      @size-change="refreshList"
      @current-change="fetchAptitudeList"
      class="mt-3" />
    <!-- 添加/修改弹窗 -->
    <A_EDialog
      v-model:A_EVisible="A_EVisible"
      :A_ETitle="A_ETitle"
      :submitForm="submitForm">
      <template #headerBtn>
        <span class="ms-2" v-if="!isAdd">ID: {{ A_EFormData?.id }}</span>
      </template>
      <el-form
        ref="A_EFormRef"
        :model="A_EFormData"
        :rules="rules"
        label-width="100px">
        <el-form-item label="小程序资质图片" prop="image">
          <el-image
            fit="cover"
            style="width: 100px; height: 100px"
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
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="A_EFormData.sort" :min="0" />
        </el-form-item>
      </el-form>
    </A_EDialog>
  </div>
</template>
<script lang="ts" setup>
  import {
    addAptitude,
    delAptitude,
    editAptitude,
    getAptitudeList,
  } from "@/api/wxapp/aptitude";
  import { allFileUpload } from "@/api/upload";
  import { usePaginationStore } from "@/stores/pagination";
  import { AptitudeItem } from "@/types/wxapp/aptitude";
  import { debugLog } from "@/utils/debug";
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm";
  import {
    ElMessage,
    FormInstance,
    FormRules,
    TableInstance,
  } from "element-plus";
  import { cloneDeep } from "lodash";
  import { computed, onMounted, reactive, ref } from "vue";
  const BASEURL = import.meta.env.VITE_APP_API_BASE_URL;

  // 查询表单数据---------------------------------
  const currentPage = ref(1);
  const paginationStore = usePaginationStore();
  const total = ref(0);
  const aptitudeList = ref<AptitudeItem[]>([]);
  const fetchAptitudeList = async () => {
    const res = await getAptitudeList({
      pageNum: currentPage.value,
      pageSize: paginationStore.pageSize,
    });

    debugLog("小程序资质图片列表=>", res);

    if (res.code === 200) {
      if (res.rows) aptitudeList.value = res.rows;
      if (res.total) total.value = res.total;
    } else ElMessage.error(res.msg || "获取小程序资质图片列表失败");
  };
  onMounted(fetchAptitudeList);
  const refreshList = () => {
    currentPage.value = 1;
    fetchAptitudeList();
  };

  // 添加/修改表单-------------------------------------
  const defaultForm: AptitudeItem = {
    sort: 0,
  };
  const A_EVisible = ref(false);
  const A_ETitle = ref("");
  const isAdd = ref(true);
  const A_EFormData = reactive<AptitudeItem>(cloneDeep(defaultForm));
  const A_EFormRef = ref<FormInstance>();
  const cropperUploadRef = ref();
  const showClearBtn = computed(() => {
    return (
      A_EFormData.image !== undefined &&
      A_EFormData.image !== "#" &&
      A_EFormData.image !== ""
    );
  });

  const rules: FormRules = {
    image: [
      {
        required: true,
        validator: (_rule, value, callback) => {
          if (!value && !croppedFile.value)
            callback(new Error("请上传小程序资质图片"));
          else callback();
        },
        trigger: "change",
      },
    ],
    sort: [{ required: true, message: "请输入排序号", trigger: "change" }],
  };

  // 图片相关
  const croppedFile = ref<File>();
  const A_EImgUrl = computed(() =>
    croppedFile.value
      ? URL.createObjectURL(croppedFile.value)
      : BASEURL + A_EFormData.image
  );
  const A_EImgPreviewSrcList = computed(() =>
    croppedFile.value
      ? [URL.createObjectURL(croppedFile.value)]
      : [BASEURL + A_EFormData.image]
  );
  const clearImg = () => {
    A_EFormData.image = "";
  };

  const toAddAptitude = () => {
    A_ETitle.value = "添加小程序资质图片";
    isAdd.value = true;
    Object.assign(A_EFormData, defaultForm);
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
  };

  const toEditAptitude = (row: AptitudeItem) => {
    A_ETitle.value = "修改小程序资质图片";
    isAdd.value = false;
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
    Object.assign(A_EFormData, row);
  };

  // 提交表单
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
        A_EFormData.image = croppedRes.fileName;
      }

      const apiMethod = isAdd.value ? addAptitude : editAptitude;
      const res = await apiMethod(A_EFormData);
      debugLog(`${A_ETitle.value}结果=>`, res);
      if (res.code === 200) {
        A_EVisible.value = false;
        ElMessage.success(`${A_ETitle.value}成功`);
        fetchAptitudeList();
      } else ElMessage.error(res.msg || `${A_ETitle.value}失败`);
    });
  };

  // 删除--------------------------------------
  const selectedAptitudes = ref<AptitudeItem[]>([]);
  const aptitudeTable = ref<TableInstance>();
  const handleSelectionChange = (selection: AptitudeItem[]) => {
    selectedAptitudes.value = selection;
  };
  const toDelAptitude = (row: AptitudeItem) => {
    // 勾选当前行
    aptitudeTable.value?.toggleRowSelection(row, true);
    elMessageBoxConfirm(
      `删除以下${
        selectedAptitudes.value.length
      }个小程序资质图片 ID: ${selectedAptitudes.value.map((i) => i.id)}`,
      async () => {
        const aptitudeIds = selectedAptitudes.value
          .map((i) => i.id)
          .filter((id) => id !== undefined);
        const res = await delAptitude(aptitudeIds);
        debugLog("删除小程序资质图片=>", res);
        if (res.code === 200) {
          ElMessage.success("删除成功");
          selectedAptitudes.value = [];
          // 假设有一个获取小程序资质图片列表的方法
          fetchAptitudeList();
        } else ElMessage.error(res.msg || "删除失败");
      }
    );
  };
</script>
