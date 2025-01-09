<template>
  <div>
    <!-- 搜索表单 -->
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
        <el-button type="primary" @click="fetchMenuList">搜索</el-button>
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
                      v-model:A_EFormData="A_EFormData"
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
              v-model:A_EFormData="A_EFormData"
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
        v-model:A_EFormData="A_EFormData"
        v-model:MenuTreeSelect="menuTreeSelect" />
    </CustomMenuTable>
    <!-- 添加/修改弹窗 -->
    <A_EDialog
      v-model:A_EVisible="A_EVisible"
      :A_ETitle="A_ETitle"
      :submitForm="submitForm">
      <template #headerBtn>
        <span class="ms-2" v-if="!isAdd"
          >ID:{{ A_EFormData && A_EFormData["menuId"] }}</span
        >
      </template>
      <el-form
        :model="A_EFormData"
        ref="A_EFormRef"
        label-width="auto"
        :rules="rules"
        v-if="A_EFormData">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="A_EFormData.menuName" />
        </el-form-item>
        <div class="d-flex align-items-center justify-content-between">
          <el-form-item label="菜单类型" prop="menuType">
            <el-radio-group v-model="A_EFormData.menuType">
              <el-radio-button :value="'M'">目录</el-radio-button>
              <el-radio-button :value="'C'">菜单</el-radio-button>
              <el-radio-button :value="'F'">按钮</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序" prop="orderNum">
            <el-input-number
              v-model.number="A_EFormData.orderNum"
              :min="0"
              :max="99"
              placeholder="排序号" />
          </el-form-item>
        </div>
        <el-form-item label="上级目录" prop="parentId">
          <el-tree-select
            v-model="A_EFormData.parentId"
            :data="menuTreeSelect"
            check-strictly
            :render-after-expand="false" />
        </el-form-item>
        <CustomFormItemTip
          label="路由路径"
          prop="path"
          tip="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
          v-show="A_EFormData.menuType !== 'F'">
          <el-input v-model="A_EFormData.path" />
        </CustomFormItemTip>
        <CustomFormItemTip
          label="组件地址"
          prop="component"
          tip="访问的组件路径，如：`system/user/index`，默认在`views`目录下"
          v-show="A_EFormData.menuType !== 'F' && A_EFormData.menuType !== 'M'">
          <el-input v-model="A_EFormData.component" />
        </CustomFormItemTip>
        <CustomFormItemTip
          label="权限字符"
          prop="perms"
          tip="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
          v-if="A_EFormData.menuType !== 'M'">
          <el-input v-model="A_EFormData.perms" />
        </CustomFormItemTip>
        <el-form-item
          label="图标"
          prop="icon"
          v-show="A_EFormData.menuType !== 'F'">
          <el-input v-model="A_EFormData.icon" />
        </el-form-item>
        <div
          class="d-flex align-items-center justify-content-between"
          v-show="A_EFormData.menuType !== 'F'">
          <CustomFormItemTip
            prop="isFrame"
            label="外链"
            tip="选择是外链则路由地址需要以`http(s)://`开头">
            <el-radio-group v-model="A_EFormData.isFrame">
              <el-radio-button :value="'0'">是</el-radio-button>
              <el-radio-button :value="'1'">否</el-radio-button>
            </el-radio-group>
          </CustomFormItemTip>
          <CustomFormItemTip
            label="缓存"
            prop="isCache"
            tip="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致">
            <el-radio-group v-model="A_EFormData.isCache">
              <el-radio-button :value="'0'">缓存</el-radio-button>
              <el-radio-button :value="'1'">不缓存</el-radio-button>
            </el-radio-group>
          </CustomFormItemTip>
        </div>
        <div class="d-flex align-items-center justify-content-between">
          <CustomFormItemTip
            label="状态"
            prop="status"
            tip="选择停用则路由将不会出现在侧边栏，也不能被访问">
            <el-radio-group v-model="A_EFormData.status">
              <el-radio-button
                v-for="i in dictStore.dictData.sys_normal_disable"
                :value="i.dictValue"
                >{{ i.dictLabel }}</el-radio-button
              >
            </el-radio-group>
          </CustomFormItemTip>
          <CustomFormItemTip
            label="显示隐藏"
            prop="visible"
            tip="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问">
            <el-radio-group v-model="A_EFormData.visible">
              <el-radio-button
                v-for="i in dictStore.dictData.sys_show_hide"
                :value="i.dictValue"
                >{{ i.dictLabel }}</el-radio-button
              >
            </el-radio-group>
          </CustomFormItemTip>
        </div>
      </el-form>
    </A_EDialog>
  </div>
</template>

<script lang="ts" setup>
  /** * @fileoverview 菜单管理模块的逻辑处理。 *
包含菜单列表的获取、菜单树的构建、添加/修改菜单的表单逻辑及相关验证规则。 * 使用
Vue 3 组合式 API 和 TypeScript 实现。 */

  import { GetMenuListParams, MenuItem } from "@/types/system/menu"; // 引入菜单相关类型
  import { debugLog } from "@/utils/debug"; // 调试日志工具
  import { onBeforeMount, onMounted, reactive, ref, toRaw } from "vue"; // Vue 3 组合式 API
  import { addMenu, getMenuTreeSelect, getMenuList } from "@/api/system/menu"; // 菜单 API
  import CustomMenuTable from "./CustomMenuTable.vue"; // 自定义菜单表格组件
  import MenuTableItem from "./MenuTableItem.vue"; // 菜单表格项组件
  import { AxiosResponse } from "axios"; // Axios 类型
  import { formatTreeSelectByTree } from "@/utils/el-select/formatTreeSelectByTree"; // 树形选择格式化工具
  import { ElMessage, FormInstance, FormRules } from "element-plus"; // Element Plus 组件和类型
  import { validateNoChineseOrSpaces } from "@/utils/formRegularExpression"; // 表单验证规则
  import { useDictStore } from "@/stores/dictData"; // 字典数据状态管理
  import { TreeSelectItem } from "@/types/treeSelect"; // 树选择项类型

  /**
   * 引用字典数据状态管理，用于获取系统字典数据。
   */
  const dictStore = useDictStore();

  /**
   * 在组件挂载前请求字典数据。
   */
  onBeforeMount(() => {
    dictStore.fetchDictData("sys_normal_disable");
  });

  /**
   * 菜单树数据
   * @type {Ref<MenuItem[]>}
   */
  const menuTree = ref();

  /**
   * 查询参数
   */
  const queryParams = ref<GetMenuListParams>({});

  /**
   * 构建菜单树结构
   * @param {MenuItem[]} items - 菜单项数组
   */
  const buildTree = (items: MenuItem[]) => {
    const itemMap: Map<number, MenuItem> = new Map();
    const rootItems: MenuItem[] = [];

    // 创建一个以 menuId 为键的 Map
    items.forEach((item) => {
      if (item.menuId !== undefined)
        itemMap.set(item.menuId, { ...item, children: [] });
    });

    // 构建树形结构
    items.forEach((item) => {
      if (item.menuId !== undefined) {
        const treeItem = itemMap.get(item.menuId)!;
        if (
          item.parentId === 0 ||
          (item.parentId !== undefined && !itemMap.has(item.parentId))
        )
          rootItems.push(treeItem); // 根节点
        else if (item.parentId !== undefined) {
          const parentItem = itemMap.get(item.parentId);
          if (parentItem) parentItem.children?.push(treeItem); // 子节点
        }
      }
    });

    return rootItems;
  };

  /**
   * 获取菜单列表
   * 通过 API 获取菜单列表并构建树形结构。
   */
  const fetchMenuList = async () => {
    const res = (await getMenuList(queryParams.value)).data;
    debugLog("获取到菜单列表=>", res);

    menuTree.value = buildTree(res);
    debugLog("转换后的菜单目录=>", toRaw(menuTree.value));
  };

  /**
   * 在组件挂载时执行菜单列表的获取。
   */
  onMounted(fetchMenuList);

  /**
   * 添加/修改弹窗
   */
  const A_EVisible = ref(false);

  /**
   * 添加/修改弹窗标题
   */
  const A_ETitle = ref("");

  /**
   * 是否为添加操作
   */
  const isAdd = ref(true);

  /**
   * 默认表单数据
   * @type {MenuItem}
   */
  const defaultForm: MenuItem = {
    menuName: "",
    menuType: "C", // M目录 C菜单 F按钮
    parentId: 0,
    orderNum: 0,
    visible: "0", // 0显示 1隐藏
    status: "0", // 0正常 1停用
    isFrame: "1", // 是否外链
    isCache: "0", // 是否缓存
  };

  /**
   * 表单验证规则
   * @type {FormRules}
   */
  const rules: FormRules = {
    menuName: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
    orderNum: [{ required: true, message: "请输入排序", trigger: "blur" }],
    menuType: [
      { required: true, message: "请选择菜单类型", trigger: "change" },
    ],
    path: [
      {
        validator: (
          _rule: any,
          value: string,
          callback: (arg0?: Error) => void
        ) => {
          if (A_EFormData.menuType === "F") {
            callback(); // 按钮类型无需验证路径
            return;
          }
          if (
            (A_EFormData.menuType === "M" || A_EFormData.menuType === "C") &&
            !value
          ) {
            callback(new Error("若是目录或菜单,则路径不可为空"));
            return;
          }
          if (value) {
            const regex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
            if (!regex.test(value)) {
              callback(
                new Error("必须以英文字符开头，仅允许英文、数字和下划线")
              );
              return;
            }
          }
          callback();
        },
        trigger: "blur",
      },
    ],
    component: [{ validator: validateNoChineseOrSpaces, trigger: "blur" }],
    perms: [{ validator: validateNoChineseOrSpaces, trigger: "blur" }],
    icon: [{ validator: validateNoChineseOrSpaces, trigger: "blur" }],
  };

  /**
   * 表单数据
   * @type {MenuItem}
   */
  let A_EFormData: MenuItem;

  /**
   * 菜单树下拉选择数据
   */
  const menuTreeSelect = ref<TreeSelectItem[]>();

  /**
   * 添加/修改菜单的请求方法
   * @type {(data: MenuItem) => Promise<AxiosResponse>}
   */
  let A_EFun: (data: MenuItem) => Promise<AxiosResponse>;

  /**
   * 添加菜单
   * 初始化表单数据并打开添加菜单弹窗。
   */
  const toAddMenu = async () => {
    A_ETitle.value = "添加菜单";
    isAdd.value = true;
    A_EFun = addMenu;
    A_EFormData = reactive(defaultForm);
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
    const res = (await getMenuTreeSelect()).data;
    menuTreeSelect.value = await formatTreeSelectByTree({
      flat: res,
      rootLabel: "根目录",
    });
    debugLog("下拉树菜单列表=>", res, "格式化后=>", menuTreeSelect.value);
  };

  /**
   * 表单引用
   */
  const A_EFormRef = ref<FormInstance>();

  /**
   * 提交表单
   * 验证表单数据并提交添加/修改请求。
   */
  const submitForm = () => {
    A_EFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        const res = await A_EFun(A_EFormData);
        debugLog(`${A_ETitle.value}结果`, res);
        if (res.code === 200) {
          A_EVisible.value = false;
          ElMessage.success(`${A_ETitle.value}成功`);
          fetchMenuList();
        } else ElMessage.error(res.msg || `${A_ETitle.value}失败`);
      }
    });
  };
</script>
