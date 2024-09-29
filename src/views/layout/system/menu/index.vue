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
    <CustomMenuTable :data="menuTree">
      <el-table-column type="expand">
        <template #default="props">
          <CustomMenuTable :data="props.row.children" :level="2">
            <el-table-column type="expand">
              <template #default="props2">
                <div class="px-2" v-if="props2.row.children.length > 0">
                  <CustomMenuTable :data="props2.row.children" :level="3">
                  </CustomMenuTable>
                </div>
              </template>
            </el-table-column>
          </CustomMenuTable>
        </template>
      </el-table-column>
    </CustomMenuTable>
  </div>
</template>
<script lang="ts" setup>
  import { getMenuList } from "@/api/system/menu/list";
  import { MenuItem } from "@/types/menuItem";
  import { debugLog } from "@/utils/debug";
  import { onMounted, ref } from "vue";

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
      itemMap.set(item.menuId, { ...item, children: [] });
    });

    // 第二步: 构建树形结构
    items.forEach((item) => {
      const treeItem = itemMap.get(item.menuId)!;
      if (item.parentId === 0 || !itemMap.has(item.parentId)) {
        // 如果是根节点(parentId为0)或父节点不存在,则添加到根数组
        rootItems.push(treeItem);
      } else {
        // 否则,将当前节点添加到父节点的children数组中
        const parentItem = itemMap.get(item.parentId)!;
        parentItem.children.push(treeItem);
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

  // 组件挂载时获取菜单列表-----------------
  onMounted(() => {
    fetchMenuList();
  });
</script>
<style lang="scss" scoped></style>
