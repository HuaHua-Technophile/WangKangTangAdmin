<template>
  <div ref="quillEditor" style="min-height: 200px" />
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from "vue";
  import Quill from "quill";
  import "quill/dist/quill.snow.css";

  const { placeholder } = withDefaults(defineProps<{ placeholder: string }>(), {
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
        placeholder,
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
  });
</script>
