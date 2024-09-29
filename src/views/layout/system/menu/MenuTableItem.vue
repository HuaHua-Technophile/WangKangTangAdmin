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
        <Icon
          icon="icon-bianji"
          class="cursor-pointer"
          @click="toEditMenu(scope.row)" />
        <Icon
          icon="icon-shanchu"
          class="cursor-pointer text-danger"
          @click="toDelMenu(scope.row)" />
      </div>
    </template>
  </el-table-column>
</template>
<script lang="ts" setup>
  import { delMenu, editMenu } from "@/api/system/menu/menu";
  import { MenuItem } from "@/types/menuItem";
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm";
  import { AxiosResponse } from "axios";
  import { reactive } from "vue";
  const props = defineProps<{
    fetchMenuList: () => void;
  }>();

  // 编辑
  const A_EVisible = defineModel<boolean>("A_EVisible");
  const A_ETitle = defineModel<string>("A_ETitle");
  const isAdd = defineModel<boolean>("isAdd");
  const A_EFun =
    defineModel<(params: MenuItem) => Promise<AxiosResponse>>("A_EFun");
  const A_EForm = defineModel<MenuItem>("A_EForm");
  const toEditMenu = (row: MenuItem) => {
    A_EVisible.value = true;
    A_ETitle.value = "修改菜单";
    isAdd.value = false;
    A_EFun.value = editMenu;

    A_EForm.value = reactive({
      menuId: row.menuId,
      menuName: row.menuName,
      parentName: row.parentName,
      parentId: row.parentId,
      orderNum: row.orderNum,
      path: row.path,
      component: row.component,
      routeName: row.routeName,
      isFrame: row.isFrame, //是否为外链（0是 1否）
      isCache: row.isCache, //0缓存 1不缓存
      menuType: row.menuType, //M目录 C菜单  F按钮
      visible: row.visible, //0显示 1隐藏
      status: row.status, //0正常 1停用
      perms: row.perms,
      icon: row.icon,
    });
  };

  // 删除
  const toDelMenu = (row: MenuItem) => {
    elMessageBoxConfirm(`删除菜单,ID:${row.menuId}`, async () => {
      await delMenu(row.menuId);
      props.fetchMenuList();
    });
  };
</script>
