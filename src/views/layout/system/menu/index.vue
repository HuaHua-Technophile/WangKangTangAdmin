<template>
  <div>
    <!-- 顶部查询表单/添加按钮 -->
    <el-form
      :model="queryParams"
      class="flex-grow-1 d-flex justify-content-between align-items-center">
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
      <el-form-item>
        <el-button type="primary" @click="toAddMenu">添加菜单</el-button>
      </el-form-item>
    </el-form>
    <!-- 菜单 -->
    <CustomMenuTable :data="menuTree" :fetchMenuList="fetchMenuList">
      <el-table-column type="expand">
        <template #default="props">
          <CustomMenuTable
            :data="props.row.children"
            :level="2"
            v-if="props.row.children.length > 0">
            <el-table-column type="expand">
              <template #default="props2">
                <div class="px-2" v-if="props2.row.children.length > 0">
                  <CustomMenuTable :data="props2.row.children" :level="3">
                    <MenuTableItem
                      :fetchMenuList="fetchMenuList"
                      v-model:A_EVisible="A_EVisible"
                      v-model:A_ETitle="A_ETitle"
                      v-model:isAdd="isAdd"
                      v-model:A_EFun="A_EFun"
                      v-model:A_EForm="A_EForm"
                      v-model:MenuTreeSelect="MenuTreeSelect" />
                  </CustomMenuTable>
                </div>
              </template>
            </el-table-column>
            <MenuTableItem
              :fetchMenuList="fetchMenuList"
              v-model:A_EVisible="A_EVisible"
              v-model:A_ETitle="A_ETitle"
              v-model:isAdd="isAdd"
              v-model:A_EFun="A_EFun"
              v-model:A_EForm="A_EForm"
              v-model:MenuTreeSelect="MenuTreeSelect" />
          </CustomMenuTable>
        </template>
      </el-table-column>
      <MenuTableItem
        :fetchMenuList="fetchMenuList"
        v-model:A_EVisible="A_EVisible"
        v-model:A_ETitle="A_ETitle"
        v-model:isAdd="isAdd"
        v-model:A_EFun="A_EFun"
        v-model:A_EForm="A_EForm"
        v-model:MenuTreeSelect="MenuTreeSelect" />
    </CustomMenuTable>
    <!-- 添加/修改弹窗 -->
    <MenuDialog
      v-model:A_EVisible="A_EVisible"
      :A_ETitle="A_ETitle"
      :isAdd="isAdd"
      :width="'550px'"
      v-model:A_EForm="A_EForm"
      :idKey="idKey"
      :reQueryFun="fetchMenuList"
      :A_EFun="A_EFun"
      :MenuTreeSelect="MenuTreeSelect">
    </MenuDialog>
  </div>
</template>
<script lang="ts" setup>
  import { getMenuList } from "@/api/system/menu/list";
  import { MenuItem, MenuTreeItem } from "@/types/system/menu/menu";
  import { debugLog } from "@/utils/debug";
  import { onMounted, reactive, ref } from "vue";
  import { addMenu } from "@/api/system/menu/menu";
  import MenuDialog from "./MenuDialog.vue";
  import CustomMenuTable from "./CustomMenuTable.vue";
  import MenuTableItem from "./MenuTableItem.vue";
  import { AxiosResponse } from "axios";
  import { getMenuTreeSelect } from "@/api/system/menu/treeselect";
  import { formatTreeSelect } from "@/utils/formatTreeSelect";
  // 查询表单----------------
  const queryParams = ref({
    menuName: "",
    menuType: "",
    orderNum: undefined,
  });

  // 请求菜单列表-----------
  const menuTree = ref();
  const buildTree = (items: MenuItem[]) => {
    const itemMap: Map<number, MenuItem> = new Map();
    const rootItems: MenuItem[] = [];

    // 第一步: 创建一个以 menuId 为键的 Map
    items.forEach((item) => {
      if (item.menuId !== undefined)
        itemMap.set(item.menuId, { ...item, children: [] });
    });

    // 第二步: 构建树形结构
    items.forEach((item) => {
      if (item.menuId !== undefined) {
        const treeItem = itemMap.get(item.menuId)!;
        if (
          item.parentId === 0 ||
          (item.parentId !== undefined && !itemMap.has(item.parentId))
        )
          rootItems.push(treeItem);
        // 如果是根节点(parentId为0)或父节点不存在,则添加到根数组
        else if (item.parentId !== undefined) {
          // 否则,将当前节点添加到父节点的children数组中
          const parentItem = itemMap.get(item.parentId);
          if (parentItem) parentItem.children?.push(treeItem);
        }
      }
    });

    return rootItems;
  };
  const fetchMenuList = async () => {
    const res = (await getMenuList(queryParams.value)).data;
    debugLog("获取到菜单列表=>", res);

    menuTree.value = buildTree(res);
    debugLog("转换后的菜单列表=>", menuTree.value);
  };
  onMounted(() => {
    fetchMenuList();
  });

  // 添加/修改弹窗----------------
  const A_EVisible = ref(false);
  const A_ETitle = ref("");
  const isAdd = ref(true);
  const defaultsForm: MenuItem = {
    menuName: "",
    parentId: 0,
    orderNum: 0,
    path: "",
    component: null,
    routeName: "",
    isFrame: "1", //是否为外链（0是 1否）
    isCache: "1", //0缓存 1不缓存
    menuType: "C", //M目录 C菜单  F按钮
    visible: "0", //0显示 1隐藏
    status: "0", //0正常 1停用
    icon: "", //图标
  };
  let A_EForm: MenuItem;
  const idKey = "menuId";
  const MenuTreeSelect = ref<MenuTreeItem[]>();
  let A_EFun: (data: MenuItem) => Promise<AxiosResponse>;
  const toAddMenu = async () => {
    A_EVisible.value = true;
    A_ETitle.value = "添加菜单";
    isAdd.value = true;
    A_EFun = addMenu;
    A_EForm = reactive(defaultsForm);
    const res = (await getMenuTreeSelect()).data;
    MenuTreeSelect.value = await formatTreeSelect(res);
    debugLog("下拉树菜单列表=>", res, "格式化后=>", MenuTreeSelect.value);
  };
</script>
<style lang="scss" scoped></style>
