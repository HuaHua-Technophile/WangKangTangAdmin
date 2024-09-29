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
  <!-- <el-table-column label="路由参数" prop="query" /> -->
  <el-table-column label="外链" prop="isFrame">
    <template #default="scope">
      <el-tag :type="scope.row.isFrame == 0 ? 'primary' : 'info'">{{
        scope.row.isFrame == 0 ? "是" : "否"
      }}</el-tag>
    </template>
  </el-table-column>
  <el-table-column label="缓存" prop="isCache">
    <template #default="scope">
      <el-tag :type="scope.row.isFrame == 0 ? '' : 'info'">{{
        scope.row.isFrame == 0 ? "是" : "否"
      }}</el-tag>
    </template>
  </el-table-column>
  <el-table-column label="类型" prop="menuType">
    <template #default="scope">
      <el-tag
        :type="
          scope.row.menuType === 'M'
            ? 'primary'
            : scope.row.menuType === 'C'
            ? 'success'
            : 'warning'
        "
        >{{
          scope.row.menuType === "M"
            ? "目录"
            : scope.row.menuType === "C"
            ? "菜单"
            : "按钮"
        }}</el-tag
      >
    </template>
  </el-table-column>
  <el-table-column label="隐藏" prop="visible">
    <template #default="scope">
      <el-tag :type="scope.row.isFrame == 0 ? 'danger' : 'primary'">{{
        scope.row.isFrame == 0 ? "是" : "否"
      }}</el-tag>
    </template>
  </el-table-column>
  <el-table-column label="停用" prop="status">
    <template #default="scope">
      <el-tag :type="scope.row.isFrame == 0 ? 'danger' : 'primary'">{{
        scope.row.isFrame == 0 ? "停用" : "正常"
      }}</el-tag>
    </template>
  </el-table-column>
  <el-table-column label="权限" prop="perms" />
  <el-table-column label="排序" prop="orderNum" />
  <el-table-column label="子级" prop="children.length" />
  <el-table-column label="更新(创建)">
    <template #default="scope">
      <!-- effect="light/dark"是反过来的  -->
      <el-tooltip effect="light" placement="left">
        <template #content>
          更新: {{ scope.row.updateTime || "无" }} <br />创建:
          {{ scope.row.createTime || "无" }}
        </template>
        <div>
          {{ (scope.row.updateTime || scope.row.createTime).slice(5, 16) }}
        </div>
      </el-tooltip>
    </template>
  </el-table-column>
  <el-table-column label="操作">
    <template #default="scope">
      <div class="d-flex justify-content-between align-items-center">
        <Icon icon="icon-bianji" class="cursor-pointer" />
        <Icon icon="icon-shanchu" class="cursor-pointer text-danger" />
      </div>
    </template>
  </el-table-column>
</template>
<script lang="ts" setup></script>
