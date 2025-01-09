<!--
  文件名: RichTextEditor.vue
  描述: 一个基于 Quill 的富文本编辑器组件，支持内容的双向绑定。
  作者: [您的姓名]
  日期: [日期]
  依赖: Quill.js, Vue 3
-->

<template>
  <div
    ref="quillEditor"
    style="
      min-height: 50px;
      max-height: calc(100vh - 233px);
      overflow-y: auto;
    " />
</template>

<script setup lang="ts">
  /**
   * 导入 Vue 的核心 API 和 Quill 编辑器
   */
  import { ref, onMounted, watch } from "vue";
  import Quill from "quill";
  import "quill/dist/quill.snow.css";

  /**
   * 组件的 props 定义
   * @prop {string} placeholder - 编辑器的占位符文本，默认为 "请输入内容......"
   */
  const props = withDefaults(defineProps<{ placeholder: string }>(), {
    placeholder: "请输入内容......",
  });

  /**
   * 组件的双向绑定 modelValue 定义
   * @modelValue {string} - 编辑器的内容
   */
  const modelValue = defineModel<string>("modelValue");

  /**
   * 编辑器的 DOM 引用
   */
  const quillEditor = ref<HTMLDivElement>();

  /**
   * Quill 编辑器实例
   * @type {Quill}
   */
  let quill: Quill;

  /**
   * 初始化 Quill 编辑器并设置工具栏和占位符
   * 当编辑器内容发生变化时，同步内容到外部的 modelValue
   */
  onMounted(() => {
    if (quillEditor.value) {
      quill = new Quill(quillEditor.value, {
        theme: "snow",
        placeholder: props.placeholder,
        modules: {
          toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }, { direction: "rtl" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            ["link"],
            ["clean"], // remove formatting button
          ], // 设置工具栏选项
        },
      });

      /**
       * 监听编辑器内容的变化，并同步到 modelValue
       */
      quill.on("text-change", () => {
        modelValue.value = quill?.root.innerHTML;
      });
    }
  });

  /**
   * 初始化时将外部的 modelValue 内容同步到编辑器
   */
  onMounted(() => {
    if (modelValue.value) quill.root.innerHTML = modelValue.value;
  });

  /**
   * 监听 modelValue 的变化，确保外部的内容可以动态更新到编辑器
   * @param {string} newValue - modelValue 的新值
   */
  watch(modelValue, (newValue) => {
    if (quill && quill.root.innerHTML !== newValue)
      quill.root.innerHTML = newValue || "";
  });
</script>
