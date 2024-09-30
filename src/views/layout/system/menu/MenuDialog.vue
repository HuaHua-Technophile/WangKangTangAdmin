<template>
  <A_EDialog
    v-model:A_EVisible="A_EVisible"
    :A_ETitle="A_ETitle"
    :reQueryFun="reQueryFun"
    :submitFun="submitFun"
    :width="width"
    class="pb-0 overflow-hidden">
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
      <div class="d-flex align-items-center justify-content-between">
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="A_EForm.menuType">
            <el-radio :value="'M'">目录</el-radio>
            <el-radio :value="'C'">菜单</el-radio>
            <el-radio :value="'F'">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input-number
            v-model.number="A_EForm.orderNum"
            :min="0"
            :max="99"
            placeholder="排序号" />
        </el-form-item>
      </div>
      <el-form-item label="父菜单ID" prop="parentId">
        <el-tree-select
          v-model="A_EForm.parentId"
          :data="props.MenuTree"
          check-strictly
          :render-after-expand="false" />
      </el-form-item>

      <el-form-item label="路径" prop="path">
        <el-input v-model="A_EForm.path" />
      </el-form-item>

      <el-form-item label="组件" prop="component">
        <el-input v-model="A_EForm.component" />
      </el-form-item>

      <el-form-item label="路由名称" prop="routeName">
        <el-input v-model="A_EForm.routeName" />
      </el-form-item>

      <el-form-item label="图标" prop="icon">
        <el-input v-model="A_EForm.icon" />
      </el-form-item>
      <div class="d-flex align-items-center justify-content-between">
        <el-form-item label="外链" prop="isFrame">
          <el-radio-group v-model="A_EForm.isFrame">
            <el-radio :value="'1'">是</el-radio>
            <el-radio :value="'0'">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="缓存" prop="isCache">
          <el-radio-group v-model="A_EForm.isCache">
            <el-radio :value="'0'">缓存</el-radio>
            <el-radio :value="'1'">不缓存</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

      <div class="d-flex align-items-center justify-content-between">
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="A_EForm.status">
            <el-radio :value="'0'">正常</el-radio>
            <el-radio :value="'1'">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="显示隐藏" prop="visible">
          <el-radio-group v-model="A_EForm.visible">
            <el-radio :value="'0'">显示</el-radio>
            <el-radio :value="'1'">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
    </el-form>
  </A_EDialog>
</template>
<script lang="ts" setup>
  import { MenuItem, MenuTreeItem } from "@/types/system/menu/menu";
  import { AxiosResponse } from "axios";

  const A_EVisible = defineModel<boolean>("A_EVisible");
  const props = defineProps<{
    A_ETitle: string;
    isAdd: boolean;
    reQueryFun: () => void;
    width?: string;
    idKey?: keyof MenuItem;
    A_EForm?: MenuItem;
    A_EFun?: (data: MenuItem) => Promise<AxiosResponse>;
    MenuTree: MenuTreeItem[];
  }>();
  // 验证-----------
  const validateNoChineseOrSpaces = (
    _rule: any,
    value: string,
    callback: (arg0?: Error) => void
  ) => {
    const regex = /^[^\u4E00-\u9FFF\s]*$/; // 不能有中文和空格的正则表达式
    if (value === "") callback(); // 允许空字符串通过
    else if (!regex.test(value)) callback(new Error("不能包含中文和空格"));
    else callback();
  };
  const rules = {
    menuName: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
    orderNum: [{ required: true, message: "请输入排序", trigger: "blur" }],
    menuType: [
      { required: true, message: "请选择菜单类型", trigger: "change" },
    ],
    path: [{ validator: validateNoChineseOrSpaces, trigger: "blur" }],
    component: [{ validator: validateNoChineseOrSpaces, trigger: "blur" }],
    icon: [{ validator: validateNoChineseOrSpaces, trigger: "blur" }],
  };
  // 提交修改/添加
  const submitFun = async () => {
    console.log("MenuTree", props.MenuTree);
    /* if (props.A_EForm && props.A_EFun) await props.A_EFun(props.A_EForm); */
  };
</script>
