<template>
  <div>
    <!-- 搜索表单 -->
    <el-form
      :model="queryParams"
      class="d-flex justify-content-between align-items-center">
      <el-form-item label="角色名称" class="mx-md-2 flex-grow-1">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入角色名称"
          clearable />
      </el-form-item>
      <el-form-item label="权限字符" class="mx-md-2 flex-grow-1">
        <el-input
          v-model="queryParams.roleKey"
          placeholder="请输入角色Key"
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
        <el-button
          type="primary"
          @click="
            () => {
              currentPage = 1;
              fetchRoleList();
            }
          "
          >搜索</el-button
        >
      </el-form-item>
      <el-form-item class="mx-md-2">
        <el-button type="primary" @click="toAddRole">添加角色</el-button>
      </el-form-item>
    </el-form>
    <!-- 展示表格 -->
    <el-table
      :data="roleList"
      table-layout="auto"
      cell-class-name="text-center"
      header-cell-class-name="text-center">
      <el-table-column label="ID" prop="roleId" />
      <el-table-column label="权限字符串" prop="roleKey" />
      <el-table-column label="名称" prop="roleName" />
      <el-table-column label="排序" prop="roleSort" />
      <el-table-column label="管理员" prop="admin">
        <template #default="{ row }">
          <el-tag :type="row.isAdmin ? 'danger' : 'primary'">{{
            row.admin ? "否" : "是"
          }}</el-tag>
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
              getLabelByDictData(
                row.status,
                dictStore.dictData.sys_normal_disable
              )
            }}
          </el-tag>
        </template>
      </el-table-column>
      <DataTebleColumnTime />
      <el-table-column label="操作">
        <template #default="{ row }">
          <div
            class="d-flex justify-content-around align-items-center"
            v-if="row.roleName != '超级管理员'">
            <div
              class="d-flex align-items-center cursor-pointer"
              @click="openDrawer(row.roleId)">
              授权角色
              <Icon
                icon="icon-riLine-contacts-line"
                class="fs-5 text-primary" />
            </div>
            <Icon
              icon="icon-bianji"
              class="cursor-pointer"
              @click="toEditRole(row)" />
            <Icon
              icon="icon-shanchu"
              class="cursor-pointer text-danger"
              @click="toDelRole(row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <CustomPagination
      v-model:current-page="currentPage"
      :total="total"
      @size-change="refreshList"
      @current-change="fetchRoleList"
      class="mt-3" />
    <!-- 添加/修改弹窗 -->
    <A_EDialog
      v-model:A_EVisible="A_EVisible"
      :A_ETitle="A_ETitle"
      :submitForm="submitForm">
      <template #headerBtn>
        <span class="ms-2" v-if="!isAdd"
          >ID:{{ A_EFormData && A_EFormData["roleId"] }}</span
        >
      </template>
      <el-form
        :model="A_EFormData"
        ref="A_EFormRef"
        label-width="auto"
        :rules="rules"
        v-if="A_EFormData">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="A_EFormData.roleName" clearable />
        </el-form-item>
        <el-form-item label="权限字符" prop="roleKey">
          <el-input v-model="A_EFormData.roleKey" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="roleSort">
          <el-input-number
            v-model.number="A_EFormData.roleSort"
            :min="0"
            :max="99"
            placeholder="排序号" />
        </el-form-item>
        <div class="d-flex align-items-center justify-content-between">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="A_EFormData.status">
              <el-radio-button
                v-for="i in dictStore.dictData.sys_normal_disable"
                :value="i.dictValue"
                >{{ i.dictLabel }}</el-radio-button
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="管理员" prop="admin">
            <el-radio-group v-model="A_EFormData.admin">
              <el-radio-button :value="true">是</el-radio-button>
              <el-radio-button :value="false">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </div>
        <el-form-item label="授权菜单" prop="menuIds" v-if="!isAdd">
          <el-tree-select
            v-model="A_EFormData.menuIds"
            :data="menuTreeSelect"
            multiple
            :render-after-expand="false"
            show-checkbox
            check-strictly />
        </el-form-item>
      </el-form>
    </A_EDialog>
    <!-- 用户授权抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="`ID:${currentRoleId}的用户授权管理：上表已授权，下表未授权`"
      size="70%">
      <!-- 已授权用户列表 -->
      <el-scrollbar class="h-50">
        <UserListTable
          :users="allocatedUsers"
          :pageSize="allocatedPageSize"
          v-model:current-page="allocatedPageNum"
          v-model:selected-users="selectedAllocatedUsers"
          :total="allocatedTotal"
          action-text="取消以下用户授权"
          @action="cancelAuthorization" />
      </el-scrollbar>
      <!-- 未授权用户列表 -->
      <el-scrollbar class="h-50">
        <UserListTable
          :users="unallocatedUsers"
          :pageSize="unallocatedPageSize"
          v-model:current-page="unallocatedPageNum"
          v-model:selected-users="selectedUnallocatedUsers"
          :total="unallocatedTotal"
          action-text="授权给以下用户"
          @action="grantAuthorization" />
      </el-scrollbar>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
  /**
   * @fileoverview 角色管理页面逻辑脚本。
   * 实现了角色的增删改查、角色授权用户的管理以及与菜单的关联操作。
   * 使用 Vue 3 的组合式 API 和 TypeScript 提高代码的可读性和类型安全性。
   */

  // 引入角色管理相关的API方法和类型
  import {
    addRole,
    authUserCancel,
    authUserSelect,
    delRole,
    editRole,
    getAuthUserAllocatedList,
    getAuthUserUnallocatedList,
    getRoleList,
    getRoleMenuTreeselect,
  } from "@/api/system/role";
  import { RoleItem } from "@/types/system/role";
  import { UserItem } from "@/types/system/user";

  // 引入工具函数
  import { debugLog } from "@/utils/debug";
  import {
    getTagTypeByDictData,
    getLabelByDictData,
  } from "@/utils/system/dict/dictDataToOptions";
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm";
  import { formatTreeSelectByTree } from "@/utils/el-select/formatTreeSelectByTree";
  import { validateNoChineseOrSpaces } from "@/utils/formRegularExpression";

  // 引入第三方类型和组件
  import { AxiosResponse } from "axios";
  import { ElMessage, FormInstance, FormRules } from "element-plus";
  import { onBeforeMount, onMounted, reactive, ref, toRaw } from "vue";
  import UserListTable from "./UserListTable.vue";

  // 引入状态管理
  import { usePaginationStore } from "@/stores/pagination";
  import { useDictStore } from "@/stores/dictData";

  // 引入树形选择类型
  import { TreeSelectItem } from "@/types/treeSelect";

  /**
   * 加载字典数据，用于角色状态。
   */
  const dictStore = useDictStore();
  onBeforeMount(() => {
    dictStore.fetchDictData("sys_normal_disable");
  });

  /**
   * 角色列表相关状态和方法。
   */
  const roleList = ref<RoleItem[]>([]); // 角色列表
  const queryParams = reactive<
    Pick<RoleItem, "roleName" | "roleKey" | "status">
  >({}); // 查询参数
  const total = ref(0); // 总记录数
  const paginationStore = usePaginationStore(); // 分页状态
  const currentPage = ref(1); // 当前页码

  /**
   * 获取角色列表。
   */
  const fetchRoleList = async () => {
    const res = await getRoleList({
      pageNum: currentPage.value,
      pageSize: paginationStore.pageSize,
      ...queryParams,
    });
    debugLog("角色列表=>", res);
    if (res.rows) roleList.value = res.rows;
    if (res.total) total.value = res.total;
  };

  // 页面加载时获取角色列表
  onMounted(fetchRoleList);

  /**
   * 刷新角色列表。
   */
  const refreshList = () => {
    currentPage.value = 1;
    fetchRoleList();
  };

  /**
   * 添加/修改角色表单相关状态和方法。
   */
  const isAdd = ref(true); // 是否为添加操作
  const A_EVisible = ref(false); // 表单弹窗可见性
  const A_ETitle = ref(""); // 表单标题
  const defaultForm: RoleItem = {
    roleKey: undefined,
    roleName: undefined,
    roleSort: undefined,
    status: "0",
    menuIds: [],
  }; // 默认表单数据
  let A_EFormData: RoleItem; // 当前表单数据
  const menuTreeSelect = ref<TreeSelectItem[]>([]); // 菜单树形选择数据
  const rules: FormRules = {
    roleKey: [
      { required: true, message: "请输入权限字符", trigger: "blur" },
      { max: 15, message: "权限字符长度不能超过15个字符", trigger: "blur" },
      { validator: validateNoChineseOrSpaces, trigger: "blur" },
    ],
    roleName: [
      { required: true, message: "请输入角色名称", trigger: "blur" },
      { max: 10, message: "角色名称长度不能超过10个字符", trigger: "blur" },
    ],
    roleSort: [{ required: true, message: "请输入排序", trigger: "blur" }],
  }; // 表单校验规则
  let A_EFun: (data: RoleItem) => Promise<AxiosResponse>; // 当前提交表单的API方法
  const A_EFormRef = ref<FormInstance>(); // 表单引用

  /**
   * 提交表单。
   */
  const submitForm = async () => {
    A_EFormRef.value?.validate(async (valid: boolean) => {
      if (!valid) return;
      const res = await A_EFun(A_EFormData);
      debugLog(`${A_ETitle.value}结果=>`, res);
      if (res.code === 200) {
        A_EVisible.value = false;
        ElMessage.success(`${A_ETitle.value}成功`);
        fetchRoleList();
      } else {
        ElMessage.error(res.msg || `${A_ETitle.value}失败`);
      }
    });
  };

  /**
   * 添加角色操作。
   */
  const toAddRole = async () => {
    A_ETitle.value = "添加角色";
    isAdd.value = true;
    A_EFun = addRole;
    A_EFormData = reactive(defaultForm);
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
  };

  /**
   * 修改角色操作。
   *
   * @param {RoleItem} row - 要修改的角色数据。
   */
  const toEditRole = async (row: RoleItem) => {
    A_ETitle.value = "修改角色";
    isAdd.value = false;
    if (row.roleId) {
      const res = await getRoleMenuTreeselect(row.roleId);
      if (res.code === 200 && res.menus) {
        debugLog("已授权的菜单=>", res);
        menuTreeSelect.value = await formatTreeSelectByTree({
          flat: res.menus,
          rootLabel: "根目录",
        });

        A_EFormData = reactive({
          roleId: row.roleId,
          roleKey: row.roleKey,
          roleName: row.roleName,
          roleSort: row.roleSort,
          status: row.status,
          admin: row.admin,
          menuIds: res.checkedKeys,
        });
      }
    }

    A_EFun = editRole;
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
  };

  /**
   * 删除角色操作。
   *
   * @param {RoleItem} row - 要删除的角色数据。
   */
  const toDelRole = (row: RoleItem) => {
    elMessageBoxConfirm(
      `删除角色:${row.roleName} , ID:${row.roleId}`,
      async () => {
        if (row.roleId) {
          const res = await delRole(row.roleId);
          debugLog("删除角色结果=>", res);
          if (res.code === 200) fetchRoleList();
          else ElMessage.error(res.msg);
        }
      }
    );
  };

  /**
   * 抽屉相关状态和方法。
   */
  const drawerVisible = ref(false); // 抽屉可见性
  const currentRoleId = ref<number>(); // 当前选中的角色ID
  const allocatedUsers = ref<UserItem[]>([]); // 已授权用户列表
  const allocatedPageNum = ref(1); // 已授权用户当前页码
  const allocatedPageSize = ref(10); // 已授权用户每页数量
  const allocatedTotal = ref(0); // 已授权用户总数
  const selectedAllocatedUsers = ref([]); // 已授权用户选中项
  const unallocatedUsers = ref<UserItem[]>([]); // 未授权用户列表
  const unallocatedPageNum = ref(1); // 未授权用户当前页码
  const unallocatedPageSize = ref(10); // 未授权用户每页数量
  const unallocatedTotal = ref(0); // 未授权用户总数
  const selectedUnallocatedUsers = ref([]); // 未授权用户选中项

  /**
   * 打开用户授权管理抽屉。
   *
   * @param {number} roleId - 当前角色ID。
   */
  const openDrawer = async (roleId: number) => {
    debugLog("打开抽屉, 角色ID=>", roleId);
    currentRoleId.value = roleId;
    await fetchAllocatedUsers();
    await fetchUnallocatedUsers();
    drawerVisible.value = true;
  };

  /**
   * 获取已授权用户列表。
   */
  const fetchAllocatedUsers = async () => {
    const res = await getAuthUserAllocatedList({
      pageNum: allocatedPageNum.value,
      pageSize: allocatedPageSize.value,
      roleId: currentRoleId.value as number,
    });
    debugLog("已授权用户列表=>", res);
    if (res.code !== 200) ElMessage.error("获取已授权用户列表失败");
    else if (res.total !== undefined && res.rows) {
      allocatedUsers.value = res.rows;
      allocatedTotal.value = res.total;
    }
  };

  /**
   * 获取未授权用户列表。
   */
  const fetchUnallocatedUsers = async () => {
    const res = await getAuthUserUnallocatedList({
      pageNum: unallocatedPageNum.value,
      pageSize: unallocatedPageSize.value,
      roleId: currentRoleId.value as number,
    });
    debugLog("未授权用户列表=>", res);
    if (res.code !== 200) ElMessage.error("获取未授权用户列表失败");
    else if (res.total !== undefined && res.rows) {
      unallocatedTotal.value = res.total;
      unallocatedUsers.value = res.rows;
    }
  };

  /**
   * 重置选中项。
   */
  const resetSelection = () => {
    selectedAllocatedUsers.value = [];
    selectedUnallocatedUsers.value = [];
  };

  /**
   * 取消用户授权。
   *
   * @param {UserItem[]} users - 要取消授权的用户列表。
   */
  const cancelAuthorization = async (users: UserItem[]) => {
    debugLog("勾选了这些用户:", toRaw(users));
    const userIds = users.map((user) => user.userId!);
    const res = await authUserCancel({
      roleId: currentRoleId.value!,
      userIds: userIds,
    });
    debugLog(`取消给ID:${currentRoleId.value}授权结果=>`, res);
    if (res.code !== 200) {
      ElMessage.error(res.msg);
      fetchAllocatedUsers();
      fetchUnallocatedUsers();
    } else {
      ElMessage.success("取消授权成功");
      await fetchAllocatedUsers();
      await fetchUnallocatedUsers();
      resetSelection();
    }
  };

  /**
   * 授权用户。
   *
   * @param {UserItem[]} users - 要授权的用户列表。
   */
  const grantAuthorization = async (users: UserItem[]) => {
    debugLog("勾选了这些用户:", toRaw(users));
    const userIds = users.map((user) => user.userId!);
    const res = await authUserSelect({
      roleId: currentRoleId.value!,
      userIds: userIds,
    });
    debugLog(`授权给ID:${currentRoleId.value}结果=>`, res);
    if (res.code !== 200) ElMessage.error(res.msg || "授权失败");
    else {
      ElMessage.success("授权成功");
      await fetchAllocatedUsers();
      await fetchUnallocatedUsers();
      resetSelection();
    }
  };
</script>
