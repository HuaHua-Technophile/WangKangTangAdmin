<template>
  <div>
    <!-- 顶部查询框 -->
    <el-form
      :model="queryParams"
      class="d-flex justify-content-between align-items-center">
      <el-form-item label="菜单名称">
        <el-input v-model="queryParams.menuName" placeholder="请输入菜单名称" />
      </el-form-item>
      <el-form-item label="菜单类型">
        <el-input v-model="queryParams.menuType" placeholder="请输入菜单类型" />
      </el-form-item>
      <el-form-item label="排序号">
        <el-input
          v-model.number="queryParams.orderNum"
          type="number"
          placeholder="请输入排序号" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchMenuList">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
  import { getMenuTreeSelect } from "@/api/system/menu/treeselect";
  import { debugLog } from "@/utils/debug";
  import { onMounted, ref } from "vue";

  const queryParams = ref({
    menuName: "",
    menuType: "",
    orderNum: undefined,
  });

  // 查询菜单列表
  const fetchMenuList = async () => {
    const response = await getMenuTreeSelect(queryParams.value);
    debugLog("获取到下拉树菜单列表=>", response);
  };

  // 组件挂载时获取菜单列表
  onMounted(() => {
    fetchMenuList();
  });
</script>
