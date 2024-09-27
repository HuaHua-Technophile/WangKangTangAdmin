<template>
  <!-- 复选框 -->
  <!-- <el-table-column type="selection" width="30" /> -->
  <el-table-column label="ID" prop="menuId" />
  <el-table-column label="名称" prop="menuName" />
  <el-table-column label="图标">
    <template #default="scope">
      <!-- effect="light/dark"是反过来的  -->
      <el-tooltip effect="light" :content="scope.row.icon" placement="left">
        <div><Icon :icon="scope.row.icon" /></div>
      </el-tooltip>
    </template>
  </el-table-column>
  <el-table-column label="路径" prop="path" />
  <el-table-column label="组件地址" prop="component" />
  <el-table-column label="路由参数" prop="query" />
  <el-table-column label="是否外链" prop="isFrame" />
  <el-table-column label="是否缓存" prop="isCache" />
  <el-table-column label="菜单类型" prop="menuType" />
  <el-table-column label="隐藏" prop="visible" />
  <el-table-column label="停用" prop="status" />
  <el-table-column label="权限" prop="perms" />
  <el-table-column label="排序" prop="orderNum" />
  <el-table-column label="子级数量" prop="children.length" />
  <el-table-column label="更新+创建日期">
    <template #default="scope">
      <!-- effect="light/dark"是反过来的  -->
      <el-tooltip
        effect="light"
        :content="scope.row.updateTime"
        placement="left">
        <div>{{ scope.row.updateTime }}</div>
      </el-tooltip>
    </template>
  </el-table-column>
</template>
<script lang="ts" setup>
  /*  import { MenuItem } from "@/types/menuItem";

  const props = defineProps<{ menuList?: MenuItem[] }>(); */
</script>
