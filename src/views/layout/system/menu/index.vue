<template>
  <div>
    <!-- 顶部查询框 -->
    <el-form
      :model="queryParams"
      class="d-flex justify-content-between align-items-center">
      <el-form-item label="菜单名称">
        <el-input
          v-model="queryParams.menuName"
          placeholder="请输入菜单名称"
          clearable />
      </el-form-item>
      <el-form-item label="菜单类型">
        <el-input
          v-model="queryParams.menuType"
          placeholder="请输入菜单类型"
          clearable />
      </el-form-item>
      <el-form-item label="排序号">
        <el-input-number
          v-model.number="queryParams.orderNum"
          :min="0"
          :max="99"
          placeholder="排序号" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchMenuList">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 菜单 -->
    <el-table :data="menuTree" class="w-100">
      <!-- 展开部分 -->
      <el-table-column type="expand">
        <template #default="props"> 123 </template>
      </el-table-column>
      <el-table-column label="名称" prop="label" />
      <el-table-column label="ID" prop="id" />
      <el-table-column label="子级数量" prop="children.length" />
    </el-table>
  </div>
</template>
<script lang="ts" setup>
  import { getMenuList } from "@/api/system/menu/list";
  import { debugLog } from "@/utils/debug";
  import { onMounted, ref } from "vue";

  const queryParams = ref({
    menuName: "",
    menuType: "",
    orderNum: undefined,
  });

  const menuTree = ref();
  // 查询菜单列表
  const fetchMenuList = async () => {
    const res = (await getMenuList(queryParams.value)).data;
    debugLog("获取到菜单列表=>", res);
    res.map((i: any) => {});
  };

  // 组件挂载时获取菜单列表
  onMounted(() => {
    fetchMenuList();
  });
</script>
