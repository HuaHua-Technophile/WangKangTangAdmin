<template>
  <div>
    <!-- 顶部查询表单/添加按钮 -->
    <el-form
      :model="queryParams"
      class="d-flex justify-content-between align-items-center">
      <el-form-item label="角色Key">
        <el-input
          v-model="queryParams.roleKey"
          placeholder="请输入角色Key"
          clearable />
      </el-form-item>
      <el-form-item label="角色名称">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入角色名称"
          clearable />
      </el-form-item>
      <el-form-item label="排序号">
        <el-input-number
          v-model.number="queryParams.roleSort"
          :min="0"
          :max="99"
          placeholder="排序号" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchRoleList">查询</el-button>
      </el-form-item>
      <el-form-item>
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
        <template #default="scope">
          <el-tag :type="scope.row.isAdmin ? 'danger' : 'primary'">{{
            scope.row.isAdmin ? "否" : "是"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status">
        <template #default="scope">
          <el-tag :type="scope.row.isFrame == 0 ? 'danger' : 'primary'">{{
            scope.row.isFrame == 0 ? "停用" : "正常"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="更新时间">
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
          <div class="d-flex justify-content-around align-items-center">
            <div
              class="d-flex align-items-center cursor-pointer"
              @click="openDrawer(scope.row.roleId)">
              授权角色
              <Icon
                icon="icon-riLine-contacts-line"
                class="fs-5 text-primary" />
            </div>
            <Icon
              icon="icon-bianji"
              class="cursor-pointer"
              @click="toEditRole(scope.row)" />
            <Icon
              icon="icon-shanchu"
              class="cursor-pointer text-danger"
              @click="toDelRole(scope.row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加/修改弹窗 -->
    <A_EDialog
      v-model:A_EVisible="A_EVisible"
      :A_ETitle="A_ETitle"
      :submitForm="submitForm"
      :width="'550px'"
      class="pb-0 overflow-hidden">
      <template #headerBtn>
        <span class="ms-2" v-if="!isAdd"
          >ID:{{ A_EForm && A_EForm["roleId"] }}</span
        >
      </template>
      <el-form
        :model="A_EForm"
        ref="A_EFormRef"
        label-width="auto"
        :rules="rules"
        v-if="A_EForm">
        <el-form-item label="权限字符" prop="roleKey">
          <el-input v-model="A_EForm.roleKey" maxlength="15" clearable />
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="A_EForm.roleName" maxlength="10" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="roleSort">
          <el-input-number
            v-model.number="A_EForm.roleSort"
            :min="0"
            :max="99"
            placeholder="排序号" />
        </el-form-item>
        <div class="d-flex align-items-center justify-content-between">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="A_EForm.status">
              <el-radio :value="'0'">正常</el-radio>
              <el-radio :value="'1'">停用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="管理员" prop="admin">
            <el-radio-group v-model="A_EForm.admin">
              <el-radio :value="true">是</el-radio>
              <el-radio :value="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <el-form-item label="授权菜单" prop="menuIds" v-if="!isAdd">
          <el-tree-select
            v-model="A_EForm.menuIds"
            :data="menuTreeSelect"
            multiple
            :render-after-expand="false"
            show-checkbox />
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
          action-text="取消以上用户授权"
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
          action-text="授权给以上用户"
          @action="grantAuthorization" />
      </el-scrollbar>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
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
  import { MenuTreeItem } from "@/types/system/menu";
  import { GetRoleListParams, RoleItem } from "@/types/system/role";
  import { UserItem } from "@/types/system/user";
  import { debugLog } from "@/utils/debug";
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm";
  import { formatTreeSelect } from "@/utils/formatTreeSelect";
  import { validateNoChineseOrSpaces } from "@/utils/regularExpression";
  import { AxiosResponse } from "axios";
  import { ElMessage, FormInstance } from "element-plus";
  import { onMounted, reactive, ref, toRaw } from "vue";
  import UserListTable from "./UserListTable.vue";
  // 请求角色列表-----------
  const roleList = ref<RoleItem[]>([]);
  const queryParams = ref<GetRoleListParams>({
    roleKey: undefined,
    roleName: undefined,
    roleSort: undefined,
  });
  const fetchRoleList = async () => {
    const res = (await getRoleList(queryParams.value)).rows;
    debugLog("获取角色列表=>", res);
    if (res) roleList.value = res;
  };
  onMounted(() => {
    fetchRoleList();
  });

  // 添加/修改表单--------------
  const isAdd = ref(true);
  const A_EVisible = ref(false);
  const A_ETitle = ref("");
  const defaultsForm: RoleItem = {
    roleKey: undefined,
    roleName: undefined,
    roleSort: undefined,
    status: "0",
    menuIds: [],
  };
  let A_EForm: RoleItem;
  const menuTreeSelect = ref<MenuTreeItem[]>([]);
  const rules = {
    roleKey: [
      { required: true, message: "请输入权限字符", trigger: "blur" },
      { validator: validateNoChineseOrSpaces, trigger: "blur" },
    ],
    roleName: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
    roleSort: [{ required: true, message: "请输入排序", trigger: "blur" }],
  };
  let A_EFun: (data: RoleItem) => Promise<AxiosResponse>;

  // 提交函数
  const A_EFormRef = ref<FormInstance>();
  const submitForm = async () => {
    A_EFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        const res = await A_EFun(A_EForm);
        debugLog(`${A_ETitle.value}结果=>`, res);
        if (res.code === 200) {
          A_EVisible.value = false;
          ElMessage.success(`${A_ETitle.value}成功`);
          fetchRoleList();
        } else ElMessage.error(res.msg || `${A_ETitle.value}失败`);
      }
    });
  };
  // 添加角色---------------
  const toAddRole = async () => {
    A_ETitle.value = "添加角色";
    isAdd.value = true;
    A_EFun = addRole;
    A_EForm = reactive(defaultsForm);
    A_EVisible.value = true;
  };
  // 修改角色--------------
  const toEditRole = async (row: RoleItem) => {
    A_ETitle.value = "修改角色";
    isAdd.value = false;
    if (row.roleId) {
      const res = await getRoleMenuTreeselect(row.roleId);
      if (res.code === 200 && res.menus) {
        menuTreeSelect.value = await formatTreeSelect(res.menus);
        debugLog("已授权的菜单=>", res);

        A_EForm = reactive({
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
  };
  // 删除角色--------------
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

  // 抽屉可见性
  const drawerVisible = ref(false);

  // 当前选中的角色ID
  const currentRoleId = ref<number>();

  // 已授权用户列表状态
  const allocatedUsers = ref<UserItem[]>([]);
  const allocatedPageNum = ref(1);
  const allocatedPageSize = ref(10);
  const allocatedTotal = ref(0);
  const selectedAllocatedUsers = ref([]);

  // 未授权用户列表状态
  const unallocatedUsers = ref<UserItem[]>([]);
  const unallocatedPageNum = ref(1);
  const unallocatedPageSize = ref(10);
  const unallocatedTotal = ref(0);
  const selectedUnallocatedUsers = ref([]);

  // 打开抽屉
  const openDrawer = async (roleId: number) => {
    debugLog("打开抽屉, 角色ID=>", roleId);
    currentRoleId.value = roleId;
    await fetchAllocatedUsers();
    await fetchUnallocatedUsers();
    drawerVisible.value = true;
  };

  // 获取已授权用户列表
  const fetchAllocatedUsers = async () => {
    const res = await getAuthUserAllocatedList({
      pageNum: allocatedPageNum.value,
      pageSize: allocatedPageSize.value,
      roleId: currentRoleId.value as number,
    });
    debugLog("已授权用户列表=>", res);
    if (res.code !== 200) ElMessage.error("获取已授权用户列表失败");
    else if (res.total && res.total > 0 && res.rows && res.rows.length > 0) {
      if (res.rows) allocatedUsers.value = res.rows;
      if (res.total) allocatedTotal.value = res.total;
    }
  };

  // 获取未授权用户列表
  const fetchUnallocatedUsers = async () => {
    const res = await getAuthUserUnallocatedList({
      pageNum: unallocatedPageNum.value,
      pageSize: unallocatedPageSize.value,
      roleId: currentRoleId.value as number,
    });
    debugLog("未授权用户列表=>", res);
    if (res.code !== 200) ElMessage.error("获取未授权用户列表失败");
    else if (res.total && res.total > 0 && res.rows && res.rows.length > 0) {
      unallocatedTotal.value = res.total;
      unallocatedUsers.value = res.rows;
    }
  };

  // 取消授权
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
      await fetchAllocatedUsers();
      await fetchUnallocatedUsers();
    } else ElMessage.success("取消授权成功");
  };

  // 授权
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
    }
  };
</script>
