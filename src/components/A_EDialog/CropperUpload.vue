<template>
  <div>
    <el-upload
      :show-file-list="false"
      :on-change="handleFileChange"
      :auto-upload="false"
      :accept="IMAGE_FORMATS">
      <template #trigger>
        <el-button type="primary" v-show="!croppedFile && !showClearBtn"
          >选择图片({{ maxSize }}MB)</el-button
        >
      </template>
      <el-button
        v-show="croppedFile || showClearBtn"
        @click.stop="clearSelection"
        >清除所选</el-button
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
  /**
   * 文件级别注释:
   * 这是一个图片上传和裁剪组件，基于Element Plus和Cropper.js实现。
   * 支持裁剪、生成缩略图、上传裁剪后的图片，并提供文件大小和格式校验。
   * 配置项通过props传递，确保组件的灵活性。
   */

  import { ref, defineProps, nextTick } from "vue";
  import { ElMessage, UploadFile } from "element-plus";
  import Cropper from "cropperjs";
  import "cropperjs/dist/cropper.css";
  import { debugLog } from "@/utils/debug";
  import { AxiosResponse } from "axios";

  /**
   * 组件的Props定义
   */
  const props = withDefaults(
    defineProps<{
      /**
       * 上传API函数，接收File类型，并返回Promise<AxiosResponse>
       */
      uploadApi: (file: File) => Promise<AxiosResponse>;

      /**
       * 是否显示上传按钮
       * @default true
       */
      showUploadBtn?: boolean;

      /**
       * 是否需要生成缩略图
       * @default false
       */
      needThumbnail?: boolean;

      /**
       * 裁剪宽高比
       * @default 1
       */
      aspectRatio?: number;

      /**
       * 裁剪框的最小宽度或高度
       * @default 100
       */
      minCropBoxWidthOrHeight?: number;

      /**
       * 裁剪图的最大宽度或高度
       * @default 1920
       */
      maxWidthOrHeight?: number;

      /**
       * 上传图片的最大大小（单位MB）
       * @default 2
       */
      maxSize?: number;

      /**
       * 缩略图的最大宽度或高度
       * @default 100
       */
      maxThumbnailWidthOrHeight?: number;

      /**
       * 上传成功的提示消息
       */
      successMsg?: string;

      /**
       * 是否显示清除按钮
       * @default false
       */
      showClearBtn?: boolean;
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

  const emit = defineEmits<{
    /**
     * 清除事件
     */
    (event: "clear"): void;
  }>();

  // 常量和响应式变量
  const IMAGE_FORMATS = import.meta.env.VITE_APP_IMAGE_FORMATS;

  const showCropperDialog = ref(false);
  const previewImageUrl = ref("");
  const cropperImageRef = ref<HTMLImageElement>();
  const cropperInstance = ref<Cropper>();
  const croppedFile = defineModel<File>("croppedFile");
  const thumbnailFile = ref<File>();
  const fileName = ref("");

  /**
   * 处理文件选择变更
   * @param uploadFile - 上传的文件对象
   */
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
            aspectRatio: props.aspectRatio, // 宽高比
            zoomable: false, // 禁用缩放功能
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

  /**
   * 确认裁剪操作
   */
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
      const thumbnailCanvas = document.createElement("canvas");
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

      thumbnailFile.value = new File(
        [thumbnailBlob],
        `${fileName.value}_thumbnail`,
        {
          type: "image/jpeg",
        }
      );
    }
    cancelCrop();
  };

  /**
   * 取消裁剪并关闭对话框
   */
  const cancelCrop = () => {
    showCropperDialog.value = false;
    cropperInstance.value?.destroy();
  };

  /**
   * 上传裁剪后的图片
   */
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
      clearSelection();
      if (props.successMsg) ElMessage.success(props.successMsg);
      return { croppedRes, thumbnailRes };
    } else {
      ElMessage.error(croppedRes.msg || "上传失败");
      return { croppedRes: null, thumbnailRes: null };
    }
  };

  /**
   * 清空选择的文件
   */
  const clearSelection = () => {
    croppedFile.value = undefined;
    thumbnailFile.value = undefined;
    previewImageUrl.value = "";
    emit("clear");
  };

  defineExpose({
    handleUpload,
  });
</script>
