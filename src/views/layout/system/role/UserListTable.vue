<template>
  <div>
    <div class="mb-3 d-flex justify-content-between align-items-center">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="props.pageSize"
        :total="props.total"
        background
        hideOnSinglePage
        @current-change="handleCurrentChange" />
      <el-button
        @click="handleAction"
        :disabled="!selectedUsers.length"
        type="primary">
        {{ props.actionText }}
      </el-button>
    </div>
    <el-table
      :data="props.users"
      table-layout="auto"
      cell-class-name="text-center"
      header-cell-class-name="text-center"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="30" />
      <el-table-column prop="userId" label="ID" />
      <el-table-column prop="userName" label="账号" />
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
  /**
   * @fileoverview 用户列表组件逻辑脚本。
   * 提供了分页、选中用户操作以及触发自定义事件的功能。
   * 使用 Vue 3 的组合式 API 和 TypeScript 提高代码的类型安全性和可读性。
   */

  // 引入类型和工具函数
  import { UserItem } from "@/types/system/user";
  import { toRaw } from "vue";

  /**
   * 组件的 props 定义，包含用户列表、分页信息和操作按钮文本。
   */
  const props = withDefaults(
    defineProps<{
      /**
       * 用户列表数据
       * @type {UserItem[]}
       */
      users: UserItem[];

      /**
       * 总记录数
       * @type {number}
       */
      total: number;

      /**
       * 每页显示的记录数
       * @type {number}
       */
      pageSize: number;

      /**
       * 操作按钮的文本
       * @type {string}
       */
      actionText: string;
    }>(),
    {
      total: 0,
      pageSize: 10,
      actionText: "操作",
    }
  );

  /**
   * 当前页码，支持双向绑定。
   * @model currentPage
   */
  const currentPage = defineModel<number>("currentPage");

  /**
   * 当前选中的用户列表，支持双向绑定。
   * @model selectedUsers
   * @default []
   */
  const selectedUsers = defineModel<UserItem[]>("selectedUsers", {
    default: [],
  });

  /**
   * 处理用户选中状态变化。
   * 将选中的用户列表更新到 `selectedUsers` 中。
   *
   * @param {UserItem[]} selection - 当前选中的用户列表。
   */
  const handleSelectionChange = (selection: UserItem[]) => {
    selectedUsers.value = selection.map((item) => toRaw(item));
  };

  /**
   * 处理分页切换事件。
   * 更新当前页码。
   *
   * @param {number} page - 当前页码。
   */
  const handleCurrentChange = (page: number) => {
    currentPage.value = page;
  };

  /**
   * 定义组件的自定义事件。
   * @event action - 当点击操作按钮时触发，传递选中的用户列表。
   * @param {UserItem[]} users - 当前选中的用户列表。
   */
  const emit = defineEmits<{
    /**
     * 触发操作事件
     * @param {UserItem[]} users - 当前选中的用户列表
     */
    (e: "action", users: UserItem[]): void;
  }>();

  /**
   * 处理操作按钮的点击事件。
   * 如果有选中的用户，则触发 `action` 事件并传递选中的用户列表。
   */
  const handleAction = () => {
    if (selectedUsers.value.length) emit("action", selectedUsers.value);
  };
</script>
