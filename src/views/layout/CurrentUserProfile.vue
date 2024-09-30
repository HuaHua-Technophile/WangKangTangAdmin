<template>
  <div class="p-4">
    <el-descriptions
      title="个人信息"
      :column="2"
      :size="'large'"
      :border="true"
      v-if="currentUserProfile">
      <template #extra>
        <el-button type="primary" @click="toggleEdit">
          {{ isEditing ? "保存" : "编辑" }}
        </el-button>
        <!-- 修改密码按钮 -->
        <el-button type="primary" @click="toEditFun">修改密码</el-button>
      </template>
      <el-descriptions-item
        :rowspan="5"
        :width="250"
        label="头像"
        :align="'center'">
        <el-image
          style="width: 300px; height: 300px"
          :src="currentUserProfile.avatar" />
      </el-descriptions-item>
      <el-descriptions-item label="用户名" :align="'center'" s>
        <template v-if="isEditing">
          <el-input v-model="currentUserProfile.userName" />
        </template>
        <template v-else>
          {{ currentUserProfile.userName }}
        </template>
      </el-descriptions-item>
      <el-descriptions-item label="昵称" :align="'center'">
        <template v-if="isEditing">
          <el-input v-model="currentUserProfile.nickName" />
        </template>
        <template v-else>
          {{ currentUserProfile.nickName }}
        </template>
      </el-descriptions-item>
      <el-descriptions-item label="邮箱" :align="'center'">
        <template v-if="isEditing">
          <el-input v-model="currentUserProfile.email" />
        </template>
        <template v-else>
          {{ currentUserProfile.email }}
        </template>
      </el-descriptions-item>
      <el-descriptions-item label="手机号" :align="'center'">
        <template v-if="isEditing">
          <el-input v-model="currentUserProfile.phonenumber" />
        </template>
        <template v-else>
          {{ currentUserProfile.phonenumber }}
        </template>
      </el-descriptions-item>
      <el-descriptions-item label="性别" :align="'center'">
        <template v-if="isEditing">
          <el-select v-model="currentUserProfile.sex">
            <el-option label="男" value="1" />
            <el-option label="女" value="0" />
          </el-select>
        </template>
        <template v-else>
          {{ currentUserProfile.sex === "1" ? "男" : "女" }}
        </template>
      </el-descriptions-item>
      <el-descriptions-item label="管理员" :align="'center'">
        <el-tag :type="currentUserProfile.admin ? 'primary' : 'info'">
          {{ currentUserProfile.admin ? "是" : "否" }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="角色" :align="'center'">
        <el-tag v-for="role in currentUserProfile.roles" :key="role.roleId">
          {{ role.roleName }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="最后登录IP" :align="'center'">
        {{ currentUserProfile.loginIp }}
      </el-descriptions-item>
      <el-descriptions-item label="最后登录时间" :align="'center'">
        {{ formattedLoginDate }}
      </el-descriptions-item>
      <el-descriptions-item label="更新时间" :align="'center'">
        {{ currentUserProfile.updateTime || "无" }}
      </el-descriptions-item>
      <el-descriptions-item label="创建时间" :align="'center'">
        {{ currentUserProfile.createTime || "无" }}
      </el-descriptions-item>
    </el-descriptions>
    <!-- 修改密码 -->
    <A_EDialog
      v-model:A_EVisible="A_EVisible"
      :A_ETitle="A_ETitle"
      :reQueryFun="reQueryFun"
      :submitFun="submitFun"
      class="pb-0 overflow-hidden">
      <el-form
        :model="passwordForm"
        label-width="100px"
        :rules="passwordRules"
        ref="passwordFormRef">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            clearable
            show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            clearable
            show-password />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            clearable
            show-password />
        </el-form-item>
      </el-form>
    </A_EDialog>
  </div>
</template>
<script lang="ts" setup>
  import { updatePwd } from "@/api/system/userProfile/updatePwd";
  import { getUserProfile } from "@/api/system/userProfile/userProfile";
  import router from "@/router/router";
  import { useAuthStore } from "@/stores/auth";
  import { UserProFile } from "@/types/system/userProfile/userProfile";
  import { debugLog } from "@/utils/debug";
  import { passwordRule } from "@/utils/passwordRules";
  import { ElMessage } from "element-plus";
  import { computed, onMounted, ref } from "vue";

  // 获取个人信息-------------------
  const currentUserProfile = ref<UserProFile>();
  onMounted(async () => {
    const res = (await getUserProfile()).data;
    debugLog("个人信息=>", res);
    currentUserProfile.value = res;
  });
  const formattedLoginDate = computed(() => {
    return currentUserProfile.value?.loginDate
      ? new Date(currentUserProfile.value.loginDate).toLocaleString()
      : "";
  });

  // 编辑个人信息------------------
  const isEditing = ref(false);
  const toggleEdit = () => {
    if (isEditing.value) {
      // 这里应该调用API保存用户信息
      ElMessage.success("保存成功");
    }
    isEditing.value = !isEditing.value;
  };

  // 修改密码----------------------
  const A_EVisible = ref(false);
  const A_ETitle = ref("修改密码");
  const reQueryFun = () => {
    ElMessage.success("修改成功,请重新登录");
    const authStore = useAuthStore();
    authStore.logout();
    router.push({ name: "Login" });
  };
  const passwordForm = ref({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const passwordFormRef = ref();

  const passwordRules = {
    oldPassword: passwordRule,
    newPassword: passwordRule,
    confirmPassword: [
      { required: true, message: "请确认新密码", trigger: "blur" },
      {
        validator: (_rule: any, value: string, callback: Function) => {
          if (value !== passwordForm.value.newPassword)
            callback(new Error("两次输入的密码不一致"));
          else callback();
        },
        trigger: "blur",
      },
    ],
  };

  const submitFun = async () => {
    if (!passwordFormRef.value) return;

    await passwordFormRef.value.validate(async (valid: boolean) => {
      if (valid) {
        const res = await updatePwd({
          oldPassword: passwordForm.value.oldPassword,
          newPassword: passwordForm.value.newPassword,
        });
        debugLog("修改密码=>", res);
      } else return false;
    });
  };
  const toEditFun = () => {
    A_EVisible.value = true;
    passwordForm.value = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
    passwordFormRef.value?.resetFields();
  };
</script>
