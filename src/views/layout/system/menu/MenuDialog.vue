<template>
  <A_EDialog
    v-model:A_EVisible="A_EVisible"
    :A_ETitle="A_ETitle"
    :reQueryFun="reQueryFun"
    :submitFun="submitFun">
    <template #headerBtn>
      <span class="ms-2" v-if="!isAdd"
        >ID:{{ idKey && A_EForm && A_EForm[idKey] }}</span
      >
    </template>
    <el-form
      :model="A_EForm"
      ref="form"
      label-width="auto"
      :rules="rules"
      v-if="A_EForm">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model="A_EForm.menuName" />
      </el-form-item>
      <el-form-item label="菜单类型" prop="menuType">
        <el-select v-model="A_EForm.menuType">
          <el-option label="目录" value="M" />
          <el-option label="菜单" value="C" />
          <el-option label="按钮" value="F" />
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="orderNum">
        <el-input-number
          v-model.number="A_EForm.orderNum"
          :min="0"
          :max="99"
          placeholder="排序号" />
      </el-form-item>
      <el-form-item label="父菜单ID" prop="parentId">
        <el-input type="number" v-model="A_EForm.parentId" />
      </el-form-item>
      <el-form-item label="路径" prop="path">
        <el-input v-model="A_EForm.path" />
      </el-form-item>
      <el-form-item label="组件">
        <el-input v-model="A_EForm.component" />
      </el-form-item>
      <el-form-item label="路由名称" prop="routeName">
        <el-input v-model="A_EForm.routeName" />
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input v-model="A_EForm.icon" />
      </el-form-item>
      <el-form-item label="外链" prop="isFrame">
        <el-select v-model="A_EForm.isFrame">
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="缓存" prop="isCache">
        <el-select v-model="A_EForm.isCache">
          <el-option label="缓存" value="0" />
          <el-option label="不缓存" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="A_EForm.status">
          <el-option label="正常" value="0" />
          <el-option label="停用" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="显示隐藏" prop="visible">
        <el-select v-model="A_EForm.visible">
          <el-option label="显示" value="0" />
          <el-option label="隐藏" value="1" />
        </el-select>
      </el-form-item>
    </el-form>
  </A_EDialog>
</template>
<script lang="ts" setup>
  import { MenuItem } from "@/types/menuItem";
  import { AxiosResponse } from "axios";

  const A_EVisible = defineModel<boolean>("A_EVisible");

  const props = withDefaults(
    defineProps<{
      A_ETitle: string;
      isAdd: boolean;
      reQueryFun: () => void;
      width?: string;
      idKey?: keyof MenuItem;
      A_EForm?: MenuItem;
      A_EFun?: (data: MenuItem) => Promise<AxiosResponse>;
    }>(),
    {
      width: "485px",
    }
  );

  const rules = {
    menuName: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
    orderNum: [{ required: true, message: "请输入排序", trigger: "blur" }],
    menuType: [
      { required: true, message: "请选择菜单类型", trigger: "change" },
    ],
  };

  const submitFun = async () => {
    if (props.A_EForm && props.A_EFun) await props.A_EFun(props.A_EForm);
  };
</script>
