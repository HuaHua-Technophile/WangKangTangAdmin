<template>
  <div>
    <el-upload
      :show-file-list="false"
      :on-change="handleFileChange"
      :auto-upload="false"
      :accept="IMAGE_FORMATS">
      <template #trigger>
        <el-button type="primary" v-show="!croppedFile"
          >选择图片({{ maxSize }}MB)</el-button
        >
      </template>
      <el-button v-show="croppedFile" @click.stop="resetSelection"
        >重新选择</el-button
      >
      <el-button
        v-show="croppedFile && showUploadBtn"
        type="primary"
        @click.stop="handleUpload"
        >确认上传</el-button
      >
    </el-upload>
    <el-dialog
      v-model="showCropperDialog"
      :close-on-click-modal="false"
      fullscreen
      :append-to-body="true"
      :before-close="cancelCrop">
      <template #header>
        <el-button @click="cancelCrop">取消</el-button>
        <el-button type="primary" @click="confirmCrop">确认裁剪</el-button>
      </template>

      <div
        style="
          height: calc(
            100vh - (var(--el-dialog-padding-primary) * 3) - 32px
          ) !important;
        ">
        <img ref="cropperImageRef" :src="previewImageUrl" />
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
  import { ref, defineProps, nextTick } from "vue";
  import { ElMessage, UploadFile } from "element-plus";
  import Cropper from "cropperjs";
  import "cropperjs/dist/cropper.css";
  import { debugLog } from "@/utils/debug";
  import { AxiosResponse } from "axios";

  const props = withDefaults(
    defineProps<{
      uploadApi: (
        file: File
      ) => Promise<AxiosResponse<{ fileName?: string; imgUrl?: string }>>;
      showUploadBtn?: boolean;
      needThumbnail?: boolean;
      aspectRatio?: number;
      minCropBoxWidthOrHeight?: number;
      maxWidthOrHeight?: number;
      maxSize?: number;
      maxThumbnailWidthOrHeight?: number;
      successMsg?: string;
    }>(),
    {
      showUploadBtn: true,
      needThumbnail: false,
      aspectRatio: 1,
      minCropBoxWidthOrHeight: 100,
      maxWidthOrHeight: 1920,
      maxSize: 2,
      maxThumbnailWidthOrHeight: 100,
    }
  );

  // 常量和响应式变量
  const IMAGE_FORMATS = import.meta.env.VITE_APP_IMAGE_FORMATS;

  const showCropperDialog = ref(false);
  const previewImageUrl = ref("");
  const cropperImageRef = ref<HTMLImageElement>();
  const cropperInstance = ref<Cropper>();
  // const croppedFile = ref<File>();
  const croppedFile = defineModel<File>("croppedFile");
  const thumbnailFile = ref<File>();
  const fileName = ref("");
  // 文件变更处理函数
  const handleFileChange = async (uploadFile: UploadFile) => {
    const rawFile = uploadFile.raw;
    if (!rawFile) {
      ElMessage.error("文件读取失败");
      return false;
    }
    // 文件大小和类型校验
    if (rawFile.size / 1024 / 1024 > props.maxSize) {
      ElMessage.error(`图片大小不能超过 ${props.maxSize}MB`);
      return false;
    }
    //图片类型判断
    if (
      !IMAGE_FORMATS.split(",").some((type: string) =>
        rawFile.type.toLowerCase().includes(type.replace(".", ""))
      )
    ) {
      ElMessage.error("请上传正确的图片格式");
      return false;
    }
    fileName.value = rawFile.name.split(".")[0];

    debugLog("选择了文件=>", fileName.value);
    const reader = new FileReader();
    reader.readAsDataURL(rawFile);
    reader.onload = (e) => {
      previewImageUrl.value = String(e.target?.result);
      showCropperDialog.value = true;

      // 初始化Cropper
      nextTick(() => {
        if (cropperImageRef.value) {
          cropperInstance.value = new Cropper(cropperImageRef.value, {
            aspectRatio: props.aspectRatio, //宽高比
            zoomable: false, // 直接禁用缩放功能
            viewMode: 1, // 限制裁剪框不能超出图片
            minCropBoxWidth:
              props.aspectRatio > 1
                ? props.minCropBoxWidthOrHeight * props.aspectRatio
                : props.minCropBoxWidthOrHeight,
            minCropBoxHeight:
              props.aspectRatio > 1
                ? props.minCropBoxWidthOrHeight
                : props.minCropBoxWidthOrHeight / props.aspectRatio,
          });
        }
      });
    };
  };

  // 确认裁剪
  const confirmCrop = async () => {
    if (!cropperInstance.value) return;

    // 获取裁剪图canvas
    const croppedCanvas = cropperInstance.value.getCroppedCanvas({
      maxWidth:
        props.aspectRatio > 1
          ? props.maxWidthOrHeight
          : props.maxWidthOrHeight * props.aspectRatio,
      maxHeight:
        props.aspectRatio > 1
          ? props.maxWidthOrHeight / props.aspectRatio
          : props.maxWidthOrHeight,
    });

    // 转换裁剪图canvas为Blob
    const croppedBlob = await new Promise<Blob>((resolve) => {
      croppedCanvas.toBlob((blob) => resolve(blob!), "image/jpeg");
    });

    // 创建裁剪图，使用原始文件名
    croppedFile.value = new File([croppedBlob], fileName.value, {
      type: "image/jpeg",
    });

    // 生成缩略图
    if (props.needThumbnail) {
      // 生成裁剪图的缩略图canvas
      const thumbnailCanvas = document.createElement("canvas");
      // 裁剪图的缩略图宽高比自动换算
      const thumbnailCanvasWidth =
        props.aspectRatio > 1
          ? props.maxThumbnailWidthOrHeight
          : props.maxThumbnailWidthOrHeight * props.aspectRatio;
      const thumbnailCanvasHeight =
        props.aspectRatio > 1
          ? props.maxThumbnailWidthOrHeight / props.aspectRatio
          : props.maxThumbnailWidthOrHeight;

      thumbnailCanvas.width = thumbnailCanvasWidth;
      thumbnailCanvas.height = thumbnailCanvasHeight;
      const ctx = thumbnailCanvas.getContext("2d")!;
      ctx.drawImage(
        croppedCanvas,
        0,
        0,
        thumbnailCanvasWidth,
        thumbnailCanvasHeight
      );

      const thumbnailBlob = await new Promise<Blob>((resolve) => {
        thumbnailCanvas.toBlob((blob) => resolve(blob!), "image/jpeg");
      });
      // 为缩略图添加 _thumbnail 后缀
      thumbnailFile.value = new File(
        [thumbnailBlob],
        `${fileName.value}_thumbnail`,
        {
          type: "image/jpeg",
        }
      );
    }
    cancelCrop(); //确认裁剪后关闭对话框
  };
  // 关闭裁剪对话框
  const cancelCrop = () => {
    showCropperDialog.value = false;
    cropperInstance.value?.destroy();
  };

  // 上传裁剪图(与缩略图)
  const handleUpload = async () => {
    if (!croppedFile.value) return { croppedRes: null, thumbnailRes: null };
    let croppedRes, thumbnailRes;

    croppedRes = await props.uploadApi(croppedFile.value);
    if (props.needThumbnail && thumbnailFile.value)
      thumbnailRes = await props.uploadApi(thumbnailFile.value);

    debugLog(
      `裁剪图${props.needThumbnail ? "缩略图" : ""}上传结果`,
      croppedRes,
      thumbnailRes
    );

    if (
      croppedRes.code === 200 &&
      (!props.needThumbnail || thumbnailRes?.code === 200)
    ) {
      resetSelection();
      if (props.successMsg) ElMessage.success(props.successMsg);
      return { croppedRes, thumbnailRes };
    } else {
      ElMessage.error(croppedRes.msg || "上传失败");
      return { croppedRes: null, thumbnailRes: null };
    }
  };
  // 重新选择文件
  const resetSelection = () => {
    croppedFile.value = undefined;
    thumbnailFile.value = undefined;
    previewImageUrl.value = "";
  };

  defineExpose({
    handleUpload,
  });
</script>
