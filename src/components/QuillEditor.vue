<template>
  <div
    ref="quillEditor"
    style="
      min-height: 200px;
      max-height: calc(100vh - 233px);
      overflow-y: auto;
    " />
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from "vue";
  import Quill from "quill";
  import "quill/dist/quill.snow.css";

  const props = withDefaults(defineProps<{ placeholder: string }>(), {
    placeholder: "请输入内容......",
  });

  const modelValue = defineModel<string>("modelValue");

  const quillEditor = ref<HTMLDivElement>();
  let quill: Quill;
  // 编辑器内内容同步至外部-----------------
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
      quill.on("text-change", () => {
        modelValue.value = quill?.root.innerHTML;
      });
    }
  });

  // 外部内容同步至编辑器内-----------------
  onMounted(() => {
    if (modelValue.value) quill.root.innerHTML = modelValue.value;
  });
  watch(modelValue, (newValue) => {
    if (quill && quill.root.innerHTML !== newValue)
      quill.root.innerHTML = newValue || "";
  }); //该组件只会实例化一次,但是可能用于编辑不同的公告.因此,需要在每一次切换公告时,自动的清空编辑器并重新输入内容
</script>
