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
      <el-tag :type="row.isFrame == '0' ? 'primary' : 'info'">{{
        row.isFrame == "0" ? "是" : "否"
      }}</el-tag>
    </template>
  </el-table-column>
  <el-table-column label="缓存" prop="isCache">
    <template #default="{ row }">
      <el-tag :type="row.isCache == '0' ? 'primary' : 'info'">{{
        row.isCache == "0" ? "是" : "否"
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
  /** * @fileoverview 菜单管理的操作逻辑。 *
包括修改菜单、删除菜单以及相关表单和数据的处理。 * 使用 Vue 3 组合式 API 和
TypeScript 实现，结合 Element Plus 的 UI 组件。 */

  import { delMenu, editMenu, getMenuTreeSelect } from "@/api/system/menu"; // 菜单 API
  import { MenuItem } from "@/types/system/menu"; // 菜单类型
  import { debugLog } from "@/utils/debug"; // 调试日志工具
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm"; // 确认框工具
  import { formatTreeSelectByTree } from "@/utils/el-select/formatTreeSelectByTree"; // 树形选择格式化工具
  import {
    getTagTypeByDictData,
    getLabelByDictData,
  } from "@/utils/system/dict/dictDataToOptions"; // 字典数据工具
  import { AxiosResponse } from "axios"; // Axios 类型
  import { ElMessage } from "element-plus"; // Element Plus 消息提示
  import { onBeforeMount, reactive } from "vue"; // Vue 组合式 API
  import { useDictStore } from "@/stores/dictData"; // 字典数据状态管理
  import { TreeSelectItem } from "@/types/treeSelect"; // 树选择项类型

  /**
   * 组件接收的 props 定义。
   * @property {() => void} fetchMenuList - 重新获取菜单列表的方法。
   */
  const props = defineProps<{
    fetchMenuList: () => void;
  }>();

  /**
   * 字典数据状态管理。
   * 用于获取系统字典数据。
   */
  const dictStore = useDictStore();

  /**
   * 在组件挂载前获取字典数据。
   */
  onBeforeMount(() => {
    dictStore.fetchDictData("sys_normal_disable", "sys_show_hide");
  });

  /**
   * 添加/编辑弹窗的可见性。
   */
  const A_EVisible = defineModel<boolean>("A_EVisible");

  /**
   * 添加/编辑弹窗的标题。
   */
  const A_ETitle = defineModel<string>("A_ETitle");

  /**
   * 是否为添加操作。
   */
  const isAdd = defineModel<boolean>("isAdd");

  /**
   * 添加/编辑的请求方法。
   */
  const A_EFun =
    defineModel<(params: MenuItem) => Promise<AxiosResponse>>("A_EFun");

  /**
   * 表单数据。
   */
  const A_EFormData = defineModel<MenuItem>("A_EFormData");

  /**
   * 菜单树选择数据。
   */
  const MenuTreeSelect = defineModel<TreeSelectItem[]>("MenuTreeSelect");

  /**
   * 切换到编辑菜单状态。
   * 初始化表单数据并打开编辑菜单弹窗。
   * @param {MenuItem} row - 要编辑的菜单项数据。
   */
  const toEditMenu = async (row: MenuItem) => {
    A_ETitle.value = "修改菜单";
    isAdd.value = false;
    A_EFun.value = editMenu;
    debugLog("点击了这一行=>", row);

    // 初始化表单数据
    A_EFormData.value = reactive<MenuItem>({
      menuId: row.menuId,
      menuName: row.menuName,
      menuType: row.menuType, // M目录 C菜单 F按钮
      orderNum: row.orderNum,
      parentId: row.parentId,
      path: row.path,
      component: row.component,
      perms: row.perms, // 权限字符串
      icon: row.icon, // 图标
      isFrame: row.isFrame,
      isCache: row.isCache,
      visible: row.visible, // 0显示 1隐藏
      status: row.status, // 0正常 1停用
    });

    // 打开弹窗
    A_EVisible.value = true;

    // 获取菜单树选择数据
    const res = (await getMenuTreeSelect()).data;
    MenuTreeSelect.value = await formatTreeSelectByTree({
      flat: res,
      rootLabel: "根目录",
    });
    debugLog("下拉树菜单列表=>", res, "格式化后=>", MenuTreeSelect.value);
  };

  /**
   * 删除菜单。
   * 弹出确认框并执行删除操作。
   * @param {MenuItem} row - 要删除的菜单项数据。
   */
  const toDelMenu = (row: MenuItem) => {
    elMessageBoxConfirm(
      `删除菜单:${row.menuName} , ID:${row.menuId}`, // 确认框内容
      async () => {
        if (row.menuId) {
          const res = await delMenu(row.menuId); // 调用删除接口
          debugLog("删除菜单结果=>", res);
          if (res.code === 200) {
            props.fetchMenuList(); // 删除成功后重新获取菜单列表
          } else {
            ElMessage.error(res.msg); // 显示错误消息
          }
        }
      }
    );
  };
</script>
