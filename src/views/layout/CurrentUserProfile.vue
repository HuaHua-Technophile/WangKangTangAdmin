<!--
  文件名: UserProfile.vue
  描述: 用户个人信息管理页面，包括查看、编辑个人信息及修改密码功能。
  技术栈: Vue 3, TypeScript, Element Plus
-->
<template>
  <div class="p-4">
    <el-form :model="userProfileForm" :rules="profileRules" ref="formRef">
      <el-descriptions
        title="个人信息"
        :column="2"
        :size="'large'"
        :border="true"
        v-if="currentUserProfile">
        <template #extra>
          <el-button v-if="isEditing" @click="isEditing = false"
            >取消</el-button
          >
          <el-button type="primary" @click="toEditProfileFun">
            {{ isEditing ? "保存" : "编辑" }}
          </el-button>
          <!-- 修改密码按钮 -->
          <el-button type="primary" @click="toEditPwdFun">修改密码</el-button>
        </template>
        <el-descriptions-item
          :rowspan="5"
          :width="250"
          label="头像"
          :align="'center'">
          <el-image
            style="width: 300px; height: 300px"
            :src="imageUrl"
            :preview-src-list="previewSrcList"
            :preview-teleported="true" />
          <CropperUpload
            :uploadApi="userProfileAvatar"
            v-model:croppedFile="croppedFile"
            successMsg="头像上传成功,退出重新登录生效" />
        </el-descriptions-item>
        <el-descriptions-item label="账号" :align="'center'" class-name="py-0">
          {{ currentUserProfile.userName }}
        </el-descriptions-item>
        <el-descriptions-item label="昵称" :align="'center'" class-name="py-0">
          <template v-if="isEditing">
            <el-form-item prop="nickName">
              <el-input
                v-model="userProfileForm.nickName"
                placeholder="请输入昵称"
                clearable />
            </el-form-item>
          </template>
          <template v-else>
            {{ currentUserProfile.nickName }}
          </template>
        </el-descriptions-item>
        <el-descriptions-item label="邮箱" :align="'center'" class-name="py-0">
          <template v-if="isEditing">
            <el-form-item prop="email">
              <el-input
                v-model="userProfileForm.email"
                placeholder="请输入邮箱"
                clearable />
            </el-form-item>
          </template>
          <template v-else>
            {{ currentUserProfile.email }}
          </template>
        </el-descriptions-item>
        <el-descriptions-item
          label="手机号"
          :align="'center'"
          class-name="py-0">
          <template v-if="isEditing">
            <el-form-item prop="phonenumber">
              <el-input
                v-model="userProfileForm.phonenumber"
                placeholder="请输入手机号码"
                clearable
                maxlength="11" />
            </el-form-item>
          </template>
          <template v-else>
            {{ currentUserProfile.phonenumber }}
          </template>
        </el-descriptions-item>
        <el-descriptions-item label="性别" :align="'center'" class-name="py-0">
          <template v-if="isEditing">
            <el-form-item prop="sex">
              <el-radio-group v-model="userProfileForm.sex">
                <el-radio-button
                  v-for="i in dictStore.dictData.sys_user_sex"
                  :value="i.dictValue"
                  >{{ i.dictLabel }}</el-radio-button
                >
              </el-radio-group>
            </el-form-item>
          </template>
          <template v-else>
            {{
              getLabelByDictData(
                currentUserProfile.sex,
                dictStore.dictData.sys_user_sex
              )
            }}
          </template>
        </el-descriptions-item>
        <el-descriptions-item label="管理员" :align="'center'">
          <el-tag :type="currentUserProfile.admin ? 'primary' : 'info'">
            {{ currentUserProfile.admin ? "是" : "否" }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="角色" :align="'center'">
          <el-tag
            v-for="(role, index) in currentUserProfile.roles"
            :key="role.roleId"
            :class="[{ 'me-2': index > 0 }]">
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
    </el-form>
    <!-- 修改密码 -->
    <A_EDialog
      v-model:A_EVisible="A_EVisible"
      :A_ETitle="A_ETitle"
      :submitForm="submitForm"
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
  /** * @file User Profile Management * @description
本文件用于处理用户个人信息的管理，包括查看、编辑个人信息，修改密码，以及上传头像等功能。
* @module UserProfile */

  import {
    editUserProfile,
    getUserProfile,
    updatePwd,
    userProfileAvatar,
  } from "@/api/system/userProfile";
  import { useAuthStore } from "@/stores/auth";
  import { useDictStore } from "@/stores/dictData";
  import { UserItem } from "@/types/system/user";
  import { debugLog } from "@/utils/debug";
  import { passwordRule } from "@/utils/formRegularExpression";
  import { ElMessage, FormInstance, FormRules } from "element-plus";
  import {
    computed,
    ComputedRef,
    onBeforeMount,
    onMounted,
    reactive,
    ref,
  } from "vue";
  import { getLabelByDictData } from "@/utils/system/dict/dictDataToOptions";

  /**
   * @description 字典数据管理相关逻辑
   */
  const dictStore = useDictStore();
  onBeforeMount(() => {
    dictStore.fetchDictData("sys_user_sex");
  });

  /**
   * @description 当前用户详细信息
   */
  const currentUserProfile = ref<UserItem>();

  /**
   * @description 获取当前用户的详细个人信息
   * @returns {Promise<void>} 异步获取用户信息
   */
  const getCurrentUserProfileFun = async () => {
    const res = (await getUserProfile()).data;
    debugLog("详细个人信息=>", res);
    currentUserProfile.value = res;
  };

  onMounted(getCurrentUserProfileFun);

  /**
   * @description 格式化后的登录时间
   * @type {ComputedRef<string>}
   */
  const formattedLoginDate: ComputedRef<string> = computed(() => {
    return currentUserProfile.value?.loginDate
      ? new Date(currentUserProfile.value.loginDate).toLocaleString()
      : "";
  });

  // 编辑个人信息------------------

  /**
   * @description 是否正在编辑模式
   */
  const isEditing = ref(false);

  /**
   * @description 表单引用，用于校验和重置
   */
  const formRef = ref<FormInstance>();

  /**
   * @description 用户个人信息表单数据
   */
  const userProfileForm = reactive<UserItem>({
    nickName: "",
    email: "",
    phonenumber: "",
    sex: "1",
  });

  /**
   * @description 表单校验规则
   */
  const profileRules: FormRules = {
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
      { required: true, message: "请输入手机号", trigger: "blur" },
      {
        pattern: /^1[3-9]\d{9}$/,
        message: "请输入正确的手机号",
        trigger: "blur",
      },
    ],
  };

  /**
   * @description 切换编辑模式并提交个人信息
   */
  const toEditProfileFun = () => {
    if (isEditing.value) {
      formRef.value?.validate(async (valid: boolean) => {
        if (!valid) return;
        const res = await editUserProfile(userProfileForm);
        debugLog("更新个人信息=>", res);
        if (res.code === 200) {
          ElMessage.success("更新个人信息成功,部分信息生效需重新登录");
          getCurrentUserProfileFun();
          isEditing.value = false;
        } else ElMessage.error(res.msg || "更新个人信息失败");
      });
    } else {
      userProfileForm.userName = currentUserProfile.value?.userName || "";
      userProfileForm.nickName = currentUserProfile.value?.nickName || "";
      userProfileForm.email = currentUserProfile.value?.email || "";
      userProfileForm.phonenumber = currentUserProfile.value?.phonenumber || "";
      userProfileForm.sex = currentUserProfile.value?.sex || "1";

      formRef.value?.resetFields();
      isEditing.value = true;
    }
  };

  // 修改密码----------------------

  /**
   * @description 修改密码对话框显示状态
   */
  const A_EVisible = ref(false);

  /**
   * @description 修改密码对话框标题
   */
  const A_ETitle = ref("修改密码");

  /**
   * @description 修改密码表单数据
   */
  const passwordForm = ref({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /**
   * @description 修改密码表单引用
   */
  const passwordFormRef = ref();

  /**
   * @description 修改密码表单校验规则
   */
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

  /**
   * @description 打开修改密码对话框
   */
  const toEditPwdFun = () => {
    A_EVisible.value = true;

    passwordForm.value = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
    passwordFormRef.value?.resetFields();
  };

  /**
   * @description 提交修改密码表单
   */
  const submitForm = () => {
    passwordFormRef.value?.validate(async (valid: boolean) => {
      if (!valid) return;
      const res = await updatePwd(passwordForm.value);
      debugLog("修改密码=>", res);
      if (res.code === 200) {
        ElMessage.success("修改成功,请重新登录");
        const authStore = useAuthStore();
        authStore.logout();
      }
    });
  };

  // 上传头像-----------------------

  /**
   * @description 基础接口地址
   */
  const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;

  /**
   * @description 裁剪后的头像文件
   */
  const croppedFile = ref<File>();

  /**
   * @description 当前头像的URL地址
   * @type {ComputedRef<string>}
   */
  const imageUrl: ComputedRef<string> = computed(() =>
    croppedFile.value
      ? URL.createObjectURL(croppedFile.value)
      : baseUrl + currentUserProfile.value?.avatar
  );

  /**
   * @description 头像预览地址列表
   * @type {ComputedRef<string[]>}
   */
  const previewSrcList: ComputedRef<string[]> = computed(() =>
    croppedFile.value
      ? [URL.createObjectURL(croppedFile.value)]
      : [baseUrl + currentUserProfile.value?.avatar]
  );
</script>
