<template>
  <el-table-column label="ID" prop="menuId" />
  <el-table-column label="名称" prop="menuName" />
  <el-table-column label="图标">
    <template #default="{ row }">
      <!-- effect="light/dark"是反过来的  -->
      <el-tooltip effect="light" :content="row.icon" placement="left">
        <div><Icon :icon="row.icon" /></div>
      </el-tooltip>
    </template>
  </el-table-column>
  <el-table-column label="路由路径" prop="path" />
  <el-table-column label="组件地址" prop="component" />
  <el-table-column label="外链" prop="isFrame">
    <template #default="{ row }">
      <el-tag :type="row.isFrame == 0 ? 'primary' : 'info'">{{
        row.isFrame == 0 ? "是" : "否"
      }}</el-tag>
    </template>
  </el-table-column>
  <el-table-column label="缓存" prop="isCache">
    <template #default="{ row }">
      <el-tag :type="row.isFrame == 0 ? '' : 'info'">{{
        row.isFrame == 0 ? "是" : "否"
      }}</el-tag>
    </template>
  </el-table-column>
  <el-table-column label="类型" prop="menuType">
    <template #default="{ row }">
      <el-tag
        :type="
          row.menuType === 'M'
            ? 'primary'
            : row.menuType === 'C'
            ? 'success'
            : 'warning'
        "
        >{{
          row.menuType === "M" ? "目录" : row.menuType === "C" ? "菜单" : "按钮"
        }}</el-tag
      >
    </template>
  </el-table-column>
  <el-table-column label="隐藏">
    <template #default="{ row }">
      <el-tag
        :type="
          getTagTypeByDictData(row.visible, dictStore.dictData.sys_show_hide)
        ">
        {{ getLabelByDictData(row.visible, dictStore.dictData.sys_show_hide) }}
      </el-tag>
    </template>
  </el-table-column>
  <el-table-column label="停用">
    <template #default="{ row }">
      <el-tag
        :type="
          getTagTypeByDictData(
            row.status,
            dictStore.dictData.sys_normal_disable
          )
        ">
        {{
          getLabelByDictData(row.status, dictStore.dictData.sys_normal_disable)
        }}
      </el-tag>
    </template>
  </el-table-column>
  <el-table-column label="权限" prop="perms" />
  <el-table-column label="排序" prop="orderNum" />
  <el-table-column label="子级" prop="children.length" />
  <DataTebleColumnTime />
  <el-table-column label="操作">
    <template #default="{ row }">
      <div class="d-flex justify-content-between align-items-center">
        <Icon
          icon="icon-bianji"
          class="cursor-pointer"
          @click="toEditMenu(row)" />
        <Icon
          icon="icon-shanchu"
          class="cursor-pointer text-danger"
          @click="toDelMenu(row)" />
      </div>
    </template>
  </el-table-column>
</template>
<script lang="ts" setup>
  import { delMenu, editMenu, getMenuTreeSelect } from "@/api/system/menu";
  import { MenuItem, MenuTreeItem } from "@/types/system/menu";
  import { debugLog } from "@/utils/debug";
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm";
  import { formatTreeSelect } from "@/utils/formatTreeSelect";
  import {
    getTagTypeByDictData,
    getLabelByDictData,
  } from "@/utils/dictDataToOptions";
  import { AxiosResponse } from "axios";
  import { ElMessage } from "element-plus";
  import { onBeforeMount, reactive } from "vue";
  import { useDictStore } from "@/stores/dictData";
  const props = defineProps<{
    fetchMenuList: () => void;
  }>();

  // 字典数据--------------------
  const dictStore = useDictStore();
  onBeforeMount(() => {
    dictStore.fetchDictData("sys_normal_disable", "sys_show_hide");
  });

  // 表单-----------------------
  const A_EVisible = defineModel<boolean>("A_EVisible");
  const A_ETitle = defineModel<string>("A_ETitle");
  const isAdd = defineModel<boolean>("isAdd");
  const A_EFun =
    defineModel<(params: MenuItem) => Promise<AxiosResponse>>("A_EFun");
  const A_EForm = defineModel<MenuItem>("A_EForm");
  const MenuTreeSelect = defineModel<MenuTreeItem[]>("MenuTreeSelect");

  // 切换编辑状态------------------
  const toEditMenu = async (row: MenuItem) => {
    A_EVisible.value = true;
    A_ETitle.value = "修改菜单";
    isAdd.value = false;
    A_EFun.value = editMenu;
    debugLog("点击了这一行=>", row);
    A_EForm.value = reactive<MenuItem>({
      menuId: row.menuId,
      menuName: row.menuName,
      parentId: row.parentId,
      orderNum: row.orderNum,
      path: row.path,
      component: row.component,
      isFrame: row.isFrame,
      isCache: row.isCache,
      menuType: row.menuType, //M目录 C菜单  F按钮
      visible: row.visible, //0显示 1隐藏
      status: row.status, //0正常 1停用
      icon: row.icon, //图标
    });
    const res = (await getMenuTreeSelect()).data;
    MenuTreeSelect.value = await formatTreeSelect(res);
    debugLog("下拉树菜单列表=>", res, "格式化后=>", MenuTreeSelect.value);
  };

  // 直接删除-------------------
  const toDelMenu = (row: MenuItem) => {
    elMessageBoxConfirm(
      `删除菜单:${row.menuName} , ID:${row.menuId}`,
      async () => {
        if (row.menuId) {
          const res = await delMenu(row.menuId);
          debugLog("删除菜单结果=>", res);
          if (res.code === 200) props.fetchMenuList();
          else ElMessage.error(res.msg);
        }
      }
    );
  };
</script>
