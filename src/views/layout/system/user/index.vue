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
    </el-form>

    <!-- 用户列表表格 -->
    <el-table
      :data="userList"
      table-layout="auto"
      cell-class-name="text-center"
      header-cell-class-name="text-center">
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
            <Icon icon="icon-bianji" class="cursor-pointer" @click="" />
            <Icon
              icon="icon-shanchu"
              class="cursor-pointer text-danger"
              @click="" />
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
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from "vue";
  import { ElMessage } from "element-plus";
  import { getUserList, UserQueryParams } from "@/api/system/user";
  import { UserItem } from "@/types/system/user";
  import { PaginationParams } from "@/types/pagination";
  import { debugLog } from "@/utils/debug";
  import { formatToReadableDate } from "@/utils/formatToReadableDate";

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
</script>
