<template>
  <div>
    <!-- 搜索表单 -->
    <el-form :model="queryParams" class="d-flex align-items-center">
      <el-form-item label="账号" class="mx-md-2 flex-grow-1">
        <el-input
          v-model="queryParams.userName"
          placeholder="账号(非昵称)"
          clearable />
      </el-form-item>
      <el-form-item label="手机号" class="mx-md-2 flex-grow-1">
        <el-input
          v-model="queryParams.phonenumber"
          placeholder="请输入手机号"
          clearable
          class="flex-grow-1" />
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
              fetchUserList();
            }
          "
          >搜索</el-button
        >
      </el-form-item>
      <el-form-item class="mx-md-2">
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
      <el-table-column type="selection" width="30" :selectable="selectable" />
      <el-table-column prop="userId" label="ID" />
      <el-table-column prop="userName" label="账号" />
      <el-table-column prop="nickName" label="昵称" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="phonenumber" label="手机号" />
      <el-table-column label="性别">
        <template #default="{ row }">
          {{ getLabelByDictData(row.sex, dictStore.dictData.sys_user_sex) }}
        </template>
      </el-table-column>
      <el-table-column label="管理员">
        <template #default="{ row }">
          <el-tag :type="row.admin ? 'primary' : 'info'">
            {{ row.admin ? "是" : "否" }}
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
              getLabelByDictData(
                row.status,
                dictStore.dictData.sys_normal_disable
              )
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="loginIp" label="最后登录IP" />
      <el-table-column label="最后登录时间">
        <template #default="{ row }">
          <el-tooltip effect="light" placement="left">
            <template #content>
              最后登录: {{ formatToReadableDate(row.loginDate) }}
            </template>
            <div>
              {{ formatToReadableDate(row.loginDate, true) }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <DataTebleColumnTime />
      <el-table-column label="操作">
        <template #default="{ row }">
          <div
            class="d-flex justify-content-around align-items-center"
            v-if="!row.admin">
            <Icon
              icon="icon-bianji"
              class="cursor-pointer"
              @click="toEditUser(row)" />
            <Icon
              icon="icon-shanchu"
              class="cursor-pointer text-danger"
              @click="toDelUser(row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <CustomPagination
      v-model:current-page="currentPage"
      :total="total"
      @size-change="refreshList"
      @current-change="fetchUserList"
      class="mt-3" />

    <!-- 添加/修改用户 -->
    <A_EDialog
      v-model:A_EVisible="A_EVisible"
      :A_ETitle="A_ETitle"
      :submitForm="submitForm"
      :width="'610px'">
      <template #headerBtn>
        <span class="ms-2" v-if="!isAdd"
          >ID:{{ A_EFormData && A_EFormData["userId"] }}</span
        >
      </template>
      <el-form
        :model="A_EFormData"
        ref="A_EFormRef"
        label-width="auto"
        :rules="rules"
        v-if="A_EFormData">
        <el-form-item label="账号(不可更改)" prop="userName" v-if="isAdd">
          <el-input
            v-model="A_EFormData.userName"
            placeholder="请输入账号"
            clearable />
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input
            v-model="A_EFormData.nickName"
            placeholder="请输入昵称"
            clearable />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="A_EFormData.email"
            placeholder="请输入邮箱"
            clearable />
        </el-form-item>
        <el-form-item label="手机号码" prop="phonenumber">
          <el-input
            v-model="A_EFormData.phonenumber"
            placeholder="请输入手机号码"
            clearable
            maxlength="11" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="isAdd">
          <el-input
            v-model="A_EFormData.password"
            placeholder="密码为6~20位数,不能包含空格与中文"
            clearable
            type="password"
            show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword" v-if="isAdd">
          <el-input
            v-model="A_EFormData.confirmPassword"
            placeholder="请再次输入密码"
            clearable
            type="password"
            show-password />
        </el-form-item>
        <div class="d-flex justify-content-between align-items-center">
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="A_EFormData.sex">
              <el-radio-button
                v-for="i in dictStore.dictData.sys_user_sex"
                :value="i.dictValue"
                >{{ i.dictLabel }}</el-radio-button
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="A_EFormData.status">
              <el-radio-button
                v-for="i in dictStore.dictData.sys_normal_disable"
                :value="i.dictValue"
                >{{ i.dictLabel }}</el-radio-button
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="A_EFormData.userId" class="ms-3">
            <el-button @click="toResetPassword(A_EFormData.userId)">
              重置密码</el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </A_EDialog>
  </div>
</template>
<script setup lang="ts">
  /**
   * @file 用户管理页面逻辑
   * @description 提供用户管理页面的核心逻辑，包括用户列表的获取、添加、修改、删除以及密码重置等功能。
   * @module views/system/user
   * @author [您的名字]
   * @date [更新日期]
   */

  import { ref, reactive, onMounted, onBeforeMount } from "vue";
  import {
    ElMessage,
    FormInstance,
    FormRules,
    TableInstance,
  } from "element-plus";
  import {
    addUser,
    delUser,
    editUser,
    getUserList,
    userResetPwd,
  } from "@/api/system/user";
  import { UserFormData, UserItem } from "@/types/system/user";
  import { debugLog } from "@/utils/debug";
  import { formatToReadableDate } from "@/utils/formatToReadableDate";
  import { AxiosResponse } from "axios";
  import { passwordRule, userNameRule } from "@/utils/formRegularExpression";
  import { cloneDeep } from "lodash";
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm";
  import { usePaginationStore } from "@/stores/pagination";
  import { useDictStore } from "@/stores/dictData";
  import {
    getTagTypeByDictData,
    getLabelByDictData,
  } from "@/utils/system/dict/dictDataToOptions";
  import { getConfigValueByConfigKey } from "@/api/system/config";

  /**
   * @description 字典数据管理
   */
  const dictStore = useDictStore();
  onBeforeMount(() => {
    dictStore.fetchDictData("sys_normal_disable", "sys_user_sex");
  });

  /**
   * @description 用户列表查询参数
   */
  const queryParams = reactive<
    Pick<UserItem, "phonenumber" | "userName" | "status">
  >({
    status: "",
  });

  const currentPage = ref(1);
  const paginationStore = usePaginationStore();
  const total = ref(0);
  const userList = ref<UserItem[]>([]);

  /**
   * @description 获取用户列表
   * @async
   * @function fetchUserList
   */
  const fetchUserList = async () => {
    const res = await getUserList({
      pageNum: currentPage.value,
      pageSize: paginationStore.pageSize,
      ...queryParams,
    });
    debugLog("用户列表=>", res);
    if (res.code === 200) {
      if (res.rows) userList.value = res.rows;
      if (res.total) total.value = res.total;
    } else {
      ElMessage.error(res.msg || "获取用户列表失败");
    }
  };

  /**
   * @description 刷新用户列表
   */
  const refreshList = () => {
    currentPage.value = 1;
    fetchUserList();
  };

  // 组件挂载时获取用户列表
  onMounted(fetchUserList);

  /**
   * @description 添加或修改用户表单逻辑
   */
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
    sex: "0",
    status: "0",
  };
  let A_EFormData: UserFormData;
  let A_EFun: (data: UserItem) => Promise<AxiosResponse>;

  /**
   * @description 表单验证规则
   */
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
          if (value !== A_EFormData.password)
            callback(new Error("两次输入密码不一致"));
          else callback();
        },
        trigger: "blur",
      },
    ],
    sex: [{ required: true, message: "请选择性别", trigger: "change" }],
    status: [{ required: true, message: "请选择状态", trigger: "change" }],
  };

  const A_EFormRef = ref<FormInstance>();

  /**
   * @description 提交表单
   * @async
   * @function submitForm
   */
  const submitForm = async () => {
    A_EFormRef.value?.validate(async (valid: boolean) => {
      if (!valid) return;
      const res = await A_EFun(A_EFormData);
      debugLog("提交表单结果=>", res);
      if (res.code === 200) {
        ElMessage.success(`${A_ETitle.value}成功`);
        A_EVisible.value = false;
        fetchUserList();
      } else {
        ElMessage.error(res.msg || `${A_ETitle.value}失败`);
      }
    });
  };

  /**
   * @description 添加用户
   */
  const toAddUser = () => {
    A_ETitle.value = "添加用户";
    isAdd.value = true;
    A_EFun = addUser;
    A_EFormData = reactive(cloneDeep(defaultForm));
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
  };

  /**
   * @description 修改用户
   * @param {UserItem} data - 用户数据
   */
  const toEditUser = (data: UserItem) => {
    A_ETitle.value = "修改用户";
    isAdd.value = false;
    A_EFun = editUser;

    // 只提取需要的属性
    A_EFormData = reactive({
      userId: data.userId,
      userName: data.userName,
      nickName: data.nickName,
      email: data.email,
      phonenumber: data.phonenumber,
      sex: data.sex,
      status: data.status,
    });
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
  };

  /**
   * @description 删除用户
   */
  const selectedUsers = ref<UserItem[]>([]);
  const userTable = ref<TableInstance>();
  const selectable = (row: any) => {
    return !row.admin; // 如果不是管理员，则可以选择
  };

  /**
   * @description 处理表格行选中
   * @param {UserItem[]} selection - 选中的用户列表
   */
  const handleSelectionChange = (selection: UserItem[]) => {
    selectedUsers.value = selection;
  };

  /**
   * @description 删除选中的用户
   * @param {UserItem} row - 用户数据
   */
  const toDelUser = (row: UserItem) => {
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
          ElMessage.success("删除成功");
          selectedUsers.value = [];
          fetchUserList();
        } else {
          ElMessage.error(res.msg || "删除失败");
        }
      }
    );
  };

  /**
   * @description 重置用户密码
   * @async
   * @function toResetPassword
   * @param {number} userId - 用户ID
   */
  const toResetPassword = async (userId: number) => {
    const configValueRes = await getConfigValueByConfigKey(
      "sys.user.initPassword"
    );
    if (configValueRes.code == 200) {
      elMessageBoxConfirm(
        `重置 ID:${userId} 的密码为: ${configValueRes.msg}`,
        async () => {
          const res = await userResetPwd(userId, configValueRes.msg);
          debugLog("重置密码结果=>", res);
          if (res.code === 200) {
            ElMessage.success("重置密码成功");
          } else {
            ElMessage.error(res.msg || "重置密码失败");
          }
        }
      );
    } else {
      ElMessage.error("获取默认密码配置失败");
    }
  };
</script>
