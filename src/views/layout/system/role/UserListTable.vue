<template>
  <div>
    <div class="mb-3 d-flex justify-content-between align-items-center">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        background
        hideOnSinglePage
        @current-change="handleCurrentChange" />
      <el-button
        @click="handleAction"
        :disabled="!selectedUsers.length"
        type="primary">
        {{ actionText }}
      </el-button>
    </div>
    <el-table
      :data="users"
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
      <el-table-column label="已授权角色">
        <template #default="{ row }">
          <el-tag
            v-for="role in row.roles"
            :key="role.roleId"
            class="mx-1"
            size="small">
            {{ role.roleName }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
  import { UserItem } from "@/types/system/user";
  import { toRaw } from "vue";

  const { users, total, pageSize, actionText } = withDefaults(
    defineProps<{
      users: UserItem[];
      total: number;
      pageSize: number;
      actionText: string;
    }>(),
    {
      users: () => [],
      total: 0,
      pageSize: 10,
      actionText: "操作",
    }
  );

  const currentPage = defineModel<number>("currentPage");
  const selectedUsers = defineModel<UserItem[]>("selectedUsers", {
    default: [],
  });

  const handleSelectionChange = (selection: UserItem[]) => {
    selectedUsers.value = selection.map((item) => toRaw(item));
  };

  const handleCurrentChange = (page: number) => {
    currentPage.value = page;
  };

  // 触发action事件，并传递选中的用户
  const emit = defineEmits<{
    (e: "action", users: UserItem[]): void;
  }>();

  const handleAction = () => {
    if (selectedUsers.value.length) emit("action", selectedUsers.value);
  };
</script>
