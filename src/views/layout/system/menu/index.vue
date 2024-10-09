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
        <el-radio-group v-model="queryParams.menuType">
          <el-radio :value="''">全选</el-radio>
          <el-radio :value="'M'">目录</el-radio>
          <el-radio :value="'C'">菜单</el-radio>
          <el-radio :value="'F'">按钮</el-radio>
        </el-radio-group>
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
                      v-model:MenuTreeSelect="menuTreeSelect" />
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
              v-model:MenuTreeSelect="menuTreeSelect" />
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
        v-model:MenuTreeSelect="menuTreeSelect" />
    </CustomMenuTable>
    <!-- 添加/修改弹窗 -->
    <A_EDialog
      v-model:A_EVisible="A_EVisible"
      :A_ETitle="A_ETitle"
      :submitForm="submitForm"
      :width="'550px'"
      class="pb-0 overflow-hidden">
      <template #headerBtn>
        <span class="ms-2" v-if="!isAdd"
          >ID:{{ A_EForm && A_EForm["menuId"] }}</span
        >
      </template>
      <el-form
        :model="A_EForm"
        ref="A_EFormRef"
        label-width="auto"
        :rules="rules"
        v-if="A_EForm">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="A_EForm.menuName" />
        </el-form-item>
        <div class="d-flex align-items-center justify-content-between">
          <el-form-item label="菜单类型" prop="menuType">
            <el-radio-group v-model="A_EForm.menuType">
              <el-radio :value="'M'">目录</el-radio>
              <el-radio :value="'C'">菜单</el-radio>
              <el-radio :value="'F'">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序" prop="orderNum">
            <el-input-number
              v-model.number="A_EForm.orderNum"
              :min="0"
              :max="99"
              placeholder="排序号" />
          </el-form-item>
        </div>
        <el-form-item label="父菜单ID" prop="parentId">
          <el-tree-select
            v-model="A_EForm.parentId"
            :data="menuTreeSelect"
            check-strictly
            :render-after-expand="false" />
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="A_EForm.path" />
        </el-form-item>
        <el-form-item label="组件" prop="component">
          <el-input v-model="A_EForm.component" />
        </el-form-item>
        <el-form-item label="路由名称" prop="routeName">
          <el-input v-model="A_EForm.routeName" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="A_EForm.icon" />
        </el-form-item>
        <div class="d-flex align-items-center justify-content-between">
          <el-form-item label="外链" prop="isFrame">
            <el-radio-group v-model="A_EForm.isFrame">
              <el-radio :value="'1'">是</el-radio>
              <el-radio :value="'0'">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="缓存" prop="isCache">
            <el-radio-group v-model="A_EForm.isCache">
              <el-radio :value="'0'">缓存</el-radio>
              <el-radio :value="'1'">不缓存</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="d-flex align-items-center justify-content-between">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="A_EForm.status">
              <el-radio :value="'0'">正常</el-radio>
              <el-radio :value="'1'">停用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="显示隐藏" prop="visible">
            <el-radio-group v-model="A_EForm.visible">
              <el-radio :value="'0'">显示</el-radio>
              <el-radio :value="'1'">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </el-form>
    </A_EDialog>
  </div>
</template>
<script lang="ts" setup>
  import {
    GetMenuListParams,
    MenuItem,
    MenuTreeItem,
  } from "@/types/system/menu";
  import { debugLog } from "@/utils/debug";
  import { onMounted, reactive, ref, toRaw } from "vue";
  import { addMenu, getMenuTreeSelect, getMenuList } from "@/api/system/menu";
  import CustomMenuTable from "./CustomMenuTable.vue";
  import MenuTableItem from "./MenuTableItem.vue";
  import { AxiosResponse } from "axios";
  import { formatTreeSelect } from "@/utils/formatTreeSelect";
  import { ElMessage, FormInstance } from "element-plus";
  import { validateNoChineseOrSpaces } from "@/utils/regularExpression";

  // 请求菜单列表-----------
  const menuTree = ref();
  const queryParams = ref<GetMenuListParams>({
    menuName: undefined,
    menuType: "",
    orderNum: undefined,
  });
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
    debugLog("转换后的菜单列表=>", toRaw(menuTree.value));
  };
  onMounted(() => {
    fetchMenuList();
  });

  // 添加/修改弹窗----------------
  const A_EVisible = ref(false);
  const A_ETitle = ref("");
  const isAdd = ref(true);

  // 表单-----------
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

  const rules = {
    menuName: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
    orderNum: [{ required: true, message: "请输入排序", trigger: "blur" }],
    menuType: [
      { required: true, message: "请选择菜单类型", trigger: "change" },
    ],
    path: [{ validator: validateNoChineseOrSpaces, trigger: "blur" }],
    component: [{ validator: validateNoChineseOrSpaces, trigger: "blur" }],
    icon: [{ validator: validateNoChineseOrSpaces, trigger: "blur" }],
  };
  let A_EForm: MenuItem;
  const menuTreeSelect = ref<MenuTreeItem[]>();
  let A_EFun: (data: MenuItem) => Promise<AxiosResponse>;

  // 提交修改/添加-------------
  const toAddMenu = async () => {
    A_EVisible.value = true;
    A_ETitle.value = "添加菜单";
    isAdd.value = true;
    A_EFun = addMenu;
    A_EForm = reactive(defaultsForm);
    const res = (await getMenuTreeSelect()).data;
    menuTreeSelect.value = await formatTreeSelect(res);
    debugLog("下拉树菜单列表=>", res, "格式化后=>", menuTreeSelect.value);
  };
  const A_EFormRef = ref<FormInstance>();

  const submitForm = () => {
    A_EFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        const res = await A_EFun(A_EForm);
        debugLog(`${A_ETitle.value}结果`, res);
        if (res.code === 200) {
          A_EVisible.value = false;
          ElMessage.success(`${A_ETitle.value}成功`);
          fetchMenuList();
        }
      }
    });
  };
</script>
<style lang="scss" scoped></style>
