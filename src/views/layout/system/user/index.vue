<template>
  <div>
    <!-- 查询表单 -->
    <el-form
      :model="queryForm"
      class="d-flex justify-content-between align-items-center">
      <el-form-item label="用户名">
        <el-input
          v-model="queryForm.userName"
          placeholder="请输入用户名"
          clearable />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input
          v-model="queryForm.phonenumber"
          placeholder="请输入手机号"
          clearable />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="queryForm.status">
          <el-radio :value="''">全部</el-radio>
          <el-radio :value="'0'">禁用</el-radio>
          <el-radio :value="'1'">启用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="toAddUser">添加用户</el-button>
      </el-form-item>
    </el-form>

    <!-- 用户列表表格 -->
    <el-table
      ref="userTable"
      :data="userList"
      table-layout="auto"
      cell-class-name="text-center"
      header-cell-class-name="text-center"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="30" />
      <el-table-column prop="userId" label="ID" />
      <el-table-column prop="userName" label="用户名" />
      <el-table-column prop="nickName" label="昵称" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="phonenumber" label="手机号" />

      <el-table-column label="性别">
        <template #default="{ row }">
          {{ row.sex === "0" ? "女" : "男" }}
        </template>
      </el-table-column>
      <el-table-column label="管理员">
        <template #default="{ row }">
          <el-tag :type="row.admin ? 'primary' : 'info'">
            {{ row.admin ? "是" : "否" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === '0' ? 'primary' : 'danger'">
            {{ row.status === "0" ? "正常" : "停用" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="loginIp" label="最后登录IP" />
      <el-table-column label="最后登录时间">
        <template #default="scope">
          <el-tooltip effect="light" placement="left">
            <template #content>
              最后登录: {{ formatToReadableDate(scope.row.loginDate) }}
            </template>
            <div>
              {{ formatToReadableDate(scope.row.loginDate, true) }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <DataTebleColumnTime />
      <el-table-column label="操作">
        <template #default="scope">
          <div class="d-flex justify-content-around align-items-center">
            <Icon
              icon="icon-bianji"
              class="cursor-pointer"
              @click="toEditUser(scope.row)" />
            <Icon
              icon="icon-shanchu"
              class="cursor-pointer text-danger"
              @click="toDelUser(scope.row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      v-model:current-page="pagination.pageNum"
      v-model:page-size="pagination.pageSize"
      :total="total"
      :page-sizes="[10, 15, 20, 30, 50]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="mt-3" />

    <!-- 添加/修改用户 -->
    <A_EDialog
      v-model:A_EVisible="A_EVisible"
      :A_ETitle="A_ETitle"
      :submitForm="submitForm">
      <template #headerBtn>
        <span class="ms-2" v-if="!isAdd"
          >ID:{{ A_EForm && A_EForm["userId"] }}</span
        >
      </template>
      <el-form
        :model="A_EForm"
        ref="A_EFormRef"
        label-width="auto"
        :rules="rules"
        v-if="A_EForm">
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="A_EForm.userName"
            placeholder="请输入用户名"
            clearable />
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input
            v-model="A_EForm.nickName"
            placeholder="请输入昵称"
            clearable />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="A_EForm.email"
            placeholder="请输入邮箱"
            clearable />
        </el-form-item>
        <el-form-item label="手机号码" prop="phonenumber">
          <el-input
            v-model="A_EForm.phonenumber"
            placeholder="请输入手机号码"
            clearable
            maxlength="11" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="isAdd">
          <el-input
            v-model="A_EForm.password"
            placeholder="密码为6~20位数,不能包含空格与中文"
            clearable
            type="password"
            show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword" v-if="isAdd">
          <el-input
            v-model="A_EForm.confirmPassword"
            placeholder="请再次输入密码"
            clearable
            type="password"
            show-password />
        </el-form-item>
        <div class="d-flex justify-content-between align-items-center">
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="A_EForm.sex">
              <el-radio :value="'1'">男</el-radio>
              <el-radio :value="'0'">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="A_EForm.status">
              <el-radio :value="'0'">正常</el-radio>
              <el-radio :value="'1'">停用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="A_EForm.userId">
            <el-button @click="toResetPassword(A_EForm.userId)">
              重置密码</el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </A_EDialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from "vue";
  import { ElMessage, FormInstance, FormRules } from "element-plus";
  import {
    addUser,
    delUser,
    editUser,
    getUserList,
    UserQueryParams,
    userResetPwd,
  } from "@/api/system/user";
  import { UserFormData, UserItem } from "@/types/system/user";
  import { PaginationParams } from "@/types/pagination";
  import { debugLog } from "@/utils/debug";
  import { formatToReadableDate } from "@/utils/formatToReadableDate";
  import { AxiosResponse } from "axios";
  import { passwordRule, userNameRule } from "@/utils/formRegularExpression";
  import { cloneDeep } from "lodash";
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm";

  // 查询用户列表------------------
  const queryForm = reactive<UserQueryParams>({
    userName: "",
    phonenumber: "",
    status: "",
  });
  const pagination = reactive<PaginationParams>({
    pageNum: 1,
    pageSize: 10,
  });
  const total = ref(0);
  const userList = ref<UserItem[]>([]);
  // 获取用户列表
  const fetchUserList = async () => {
    const params = {
      ...pagination,
      ...queryForm,
    };
    const res = await getUserList(params);
    debugLog("用户列表=>", res);
    if (res.code === 200) {
      if (res.rows) userList.value = res.rows;
      if (res.total) total.value = res.total;
    } else ElMessage.error(res.msg || "获取用户列表失败");
  };
  // 查询
  const handleQuery = () => {
    pagination.pageNum = 1;
    fetchUserList();
  };
  // 处理每页显示数量变化
  const handleSizeChange = (val: number) => {
    pagination.pageSize = val;
    fetchUserList();
  };
  // 处理页码变化
  const handleCurrentChange = (val: number) => {
    pagination.pageNum = val;
    fetchUserList();
  };
  // 组件挂载时获取用户列表
  onMounted(() => {
    fetchUserList();
  });

  // 添加/修改表单--------------
  const isAdd = ref(true);
  const A_EVisible = ref(false);
  const A_ETitle = ref("");
  const defaultForm: UserFormData = {
    userName: "",
    nickName: "",
    email: "",
    phonenumber: "",
    password: "",
    confirmPassword: "",
    sex: "1",
    status: "0",
  };
  let A_EForm: UserFormData;
  let A_EFun: (data: UserItem) => Promise<AxiosResponse>;

  const rules: FormRules = {
    userName: userNameRule,
    nickName: [{ required: true, message: "请输入昵称", trigger: "blur" }],
    email: [
      { required: true, message: "请输入邮箱地址", trigger: "blur" },
      {
        type: "email",
        message: "请输入正确的邮箱地址",
        trigger: "blur",
      },
    ],
    phonenumber: [
      { required: true, message: "请输入手机号码", trigger: "blur" },
      {
        pattern: /^1[3-9]\d{9}$/,
        message: "请输入正确的手机号码",
        trigger: "blur",
      },
    ],
    password: passwordRule,
    confirmPassword: [
      {
        required: true,
        message: "请再次输入密码",
        trigger: "blur",
      },
      {
        validator: (
          _rule: any,
          value: string,
          callback: (arg0?: Error) => void
        ) => {
          if (value !== A_EForm.password) {
            callback(new Error("两次输入密码不一致"));
          } else {
            callback();
          }
        },
        trigger: "blur",
      },
    ],
    sex: [{ required: true, message: "请选择性别", trigger: "change" }],
    status: [{ required: true, message: "请选择状态", trigger: "change" }],
  };

  // 提交表单--------------------------
  const A_EFormRef = ref<FormInstance>();

  const submitForm = async () => {
    A_EFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        const res = await A_EFun(A_EForm);
        debugLog("提交表单结果=>", res);
        if (res.code === 200) {
          ElMessage.success(`${A_ETitle.value}成功`);
          A_EVisible.value = false;
          fetchUserList();
        } else ElMessage.error(res.msg || `${A_ETitle.value}失败`);
      }
    });
  };

  // 添加角色-----------------------
  const toAddUser = () => {
    A_ETitle.value = "添加用户";
    isAdd.value = true;
    A_EFun = addUser;
    A_EForm = reactive(cloneDeep(defaultForm));
    A_EVisible.value = true;
  };

  // 修改角色------------
  const toEditUser = (data: UserItem) => {
    A_ETitle.value = "修改用户";
    isAdd.value = false;
    A_EFun = editUser;

    // 只提取需要的属性
    A_EForm = reactive({
      userId: data.userId,
      userName: data.userName,
      nickName: data.nickName,
      email: data.email,
      phonenumber: data.phonenumber,
      sex: data.sex,
      status: data.status,
    });
    A_EVisible.value = true;
  };

  // 删除角色--------------
  const selectedUsers = ref<UserItem[]>([]);
  const userTable = ref();

  const handleSelectionChange = (selection: UserItem[]) => {
    selectedUsers.value = selection;
  };
  const toDelUser = (row: UserItem) => {
    // 勾选被点击的行
    userTable.value?.toggleRowSelection(row, true);
    elMessageBoxConfirm(
      `删除以下${selectedUsers.value.length}个用户ID: ${selectedUsers.value.map(
        (user) => user.userId
      )}`,
      async () => {
        const userIds = selectedUsers.value
          .map((user) => user.userId)
          .filter((id) => id !== undefined);
        const res = await delUser(userIds);
        if (res.code === 200) {
          ElMessage.success("删除成功"); // 清空选中的用户
          selectedUsers.value = [];
          fetchUserList(); // 假设您有这个方法来刷新用户列表
        } else ElMessage.error(res.msg || "删除失败");
      }
    );
  };

  // 重置密码-----------------
  const toResetPassword = (userId: number) => {
    elMessageBoxConfirm(`重置 ID:${userId} 的密码为: 123456`, async () => {
      const res = await userResetPwd(userId);
      debugLog("重置密码结果=>", res);
      if (res.code === 200) {
        ElMessage.success("重置密码成功");
      } else ElMessage.error(res.msg || "重置密码失败");
    });
  };
</script>
