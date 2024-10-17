<template>
  <div>
    <!-- 顶部查询表单/添加按钮 -->
    <el-form
      :model="queryParams"
      class="flex-grow-1 d-flex justify-content-between align-items-center">
      <el-form-item label="菜单名称" class="mx-md-2 flex-grow-1">
        <el-input
          v-model="queryParams.menuName"
          placeholder="请输入菜单名称"
          clearable />
      </el-form-item>
      <el-form-item label="状态" class="mx-md-2">
        <el-select
          v-model="queryParams.status"
          placeholder="全选"
          clearable
          style="width: 100px">
          <el-option
            v-for="option in dictStore.dictData.sys_normal_disable"
            :key="option.dictCode"
            :label="option.dictLabel"
            :value="option.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item class="mx-md-2">
        <el-button type="primary" @click="fetchMenuList">查询</el-button>
      </el-form-item>
      <el-form-item class="mx-md-2">
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
      :submitForm="submitForm">
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
        <el-form-item label="上级目录" prop="parentId">
          <el-tree-select
            v-model="A_EForm.parentId"
            :data="menuTreeSelect"
            check-strictly
            :render-after-expand="false" />
        </el-form-item>
        <CustomFormItemTip
          label="路由路径"
          prop="path"
          tip="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
          v-if="A_EForm.menuType !== 'F'">
          <el-input v-model="A_EForm.path" />
        </CustomFormItemTip>
        <CustomFormItemTip
          label="组件地址"
          prop="component"
          tip="访问的组件路径，如：`system/user/index`，默认在`views`目录下"
          v-if="A_EForm.menuType !== 'F' && A_EForm.menuType !== 'M'">
          <el-input v-model="A_EForm.component" />
        </CustomFormItemTip>
        <CustomFormItemTip
          label="权限字符"
          prop="perms"
          tip="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
          v-if="A_EForm.menuType !== 'M'">
          <el-input v-model="A_EForm.perms" />
        </CustomFormItemTip>
        <el-form-item label="图标" prop="icon" v-if="A_EForm.menuType !== 'F'">
          <el-input v-model="A_EForm.icon" />
        </el-form-item>
        <div
          class="d-flex align-items-center justify-content-between"
          v-if="A_EForm.menuType !== 'F'">
          <CustomFormItemTip
            prop="isFrame"
            label="外链"
            tip="选择是外链则路由地址需要以`http(s)://`开头">
            <el-radio-group v-model="A_EForm.isFrame">
              <el-radio :value="'1'">是</el-radio>
              <el-radio :value="'0'">否</el-radio>
            </el-radio-group>
          </CustomFormItemTip>
          <CustomFormItemTip
            label="缓存"
            prop="isCache"
            tip="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致">
            <el-radio-group v-model="A_EForm.isCache">
              <el-radio :value="'0'">缓存</el-radio>
              <el-radio :value="'1'">不缓存</el-radio>
            </el-radio-group>
          </CustomFormItemTip>
        </div>
        <div class="d-flex align-items-center justify-content-between">
          <CustomFormItemTip
            label="状态"
            prop="status"
            tip="选择停用则路由将不会出现在侧边栏，也不能被访问">
            <el-radio-group v-model="A_EForm.status">
              <el-radio
                v-for="i in dictStore.dictData.sys_normal_disable"
                :value="i.dictValue"
                >{{ i.dictLabel }}</el-radio
              >
            </el-radio-group>
          </CustomFormItemTip>
          <CustomFormItemTip
            label="显示隐藏"
            prop="visible"
            tip="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问">
            <el-radio-group v-model="A_EForm.visible">
              <el-radio
                v-for="i in dictStore.dictData.sys_show_hide"
                :value="i.dictValue"
                >{{ i.dictLabel }}</el-radio
              >
            </el-radio-group>
          </CustomFormItemTip>
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
  import { onBeforeMount, onMounted, reactive, ref, toRaw } from "vue";
  import { addMenu, getMenuTreeSelect, getMenuList } from "@/api/system/menu";
  import CustomMenuTable from "./CustomMenuTable.vue";
  import MenuTableItem from "./MenuTableItem.vue";
  import { AxiosResponse } from "axios";
  import { formatTreeSelect } from "@/utils/formatTreeSelect";
  import { ElMessage, FormInstance } from "element-plus";
  import {
    validateAlphaNumericUnderscore,
    validateNoChineseOrSpaces,
  } from "@/utils/formRegularExpression";
  import { useDictStore } from "@/stores/dictData";
  // 请求字典----------------
  const dictStore = useDictStore();
  onBeforeMount(() => {
    dictStore.fetchDictData("sys_normal_disable");
  });
  // 请求菜单列表-----------
  const menuTree = ref();
  const queryParams = ref<GetMenuListParams>({});
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
  const defaultForm: MenuItem = {
    menuName: "",
    menuType: "C", //M目录 C菜单  F按钮
    parentId: 0,
    orderNum: 0,
    visible: "0", //0显示 1隐藏
    status: "0", //0正常 1停用
  };

  const rules = {
    menuName: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
    orderNum: [{ required: true, message: "请输入排序", trigger: "blur" }],
    menuType: [
      { required: true, message: "请选择菜单类型", trigger: "change" },
    ],
    path: [
      { validator: validateAlphaNumericUnderscore, trigger: "blur" },
      { required: true, message: "请输入路由路径", trigger: "blur" },
    ],
    component: [{ validator: validateNoChineseOrSpaces, trigger: "blur" }],
    perms: [{ validator: validateNoChineseOrSpaces, trigger: "blur" }],
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
    A_EForm = reactive(defaultForm);
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
