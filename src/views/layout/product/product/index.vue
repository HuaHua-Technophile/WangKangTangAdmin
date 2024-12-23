<template>
  <div>
    <!-- 搜索表单 -->
    <el-form
      :model="queryParams"
      class="flex-grow-1 d-flex justify-content-between align-items-center">
      <el-form-item label="药品名称" class="mx-md-2 flex-grow-1">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入药品名称"
          clearable />
      </el-form-item>
      <el-form-item label="分类" class="mx-md-2">
        <el-tree-select
          v-model="queryParams.categoryId"
          :data="categoryTreeSelect"
          placeholder="请选择药品分类"
          clearable
          style="width: 200px" />
      </el-form-item>
      <el-form-item label="推荐状态" class="mx-md-2">
        <el-select
          v-model="queryParams.recommendStatus"
          placeholder="全选"
          clearable
          style="width: 80px">
          <el-option label="否" :value="0" />
          <el-option label="是" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="处方药" class="mx-md-2">
        <el-select
          v-model="queryParams.isPrescription"
          placeholder="全选"
          clearable
          style="width: 80px">
          <el-option label="否" :value="0" />
          <el-option label="是" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item class="mx-md-2">
        <el-button type="primary" @click="fetchProductList">搜索</el-button>
      </el-form-item>
      <el-form-item class="mx-md-2">
        <el-button type="primary" @click="toAddProduct">添加药品</el-button>
      </el-form-item>
    </el-form>

    <!-- 数据展示 -->
    <el-table
      ref="productTable"
      :data="productList"
      table-layout="auto"
      cell-class-name="text-center"
      header-cell-class-name="text-center"
      @selection-change="">
      <el-table-column type="selection" width="30" />
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="name" label="名称" />
      <el-table-column label="封面图">
        <template #default="{ row }">
          <el-image
            :src="BASEURL + row.miniImg"
            :preview-src-list="[BASEURL + row.imageUrl]"
            fit="cover"
            style="width: 1.7rem; height: 1.7rem"
            preview-teleported />
        </template>
      </el-table-column>
      <el-table-column prop="freightTemplateId" label="运费(元)">
        <template #default="{ row }">￥{{ row.freightTemplateId }}</template>
      </el-table-column>
      <el-table-column prop="categoryId" label="分类ID">
        <template #default="{ row }">{{
          categoryMap.get(row.categoryId) || "未知分类"
        }}</template>
      </el-table-column>
      <el-table-column prop="sale" label="销量" />
      <el-table-column prop="recommendStatus" label="推荐状态">
        <template #default="{ row }">
          <el-tag :type="row.recommendStatus === 1 ? 'success' : 'info'">
            {{ row.recommendStatus === 1 ? "已推荐" : "未推荐" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isPrescription" label="处方药">
        <template #default="{ row }">
          <el-tag :type="row.isPrescription === 1 ? 'warning' : 'info'">
            {{ row.isPrescription === 1 ? "是" : "否" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注">
        <template #default="{ row }">
          <el-tooltip
            effect="light"
            raw-content
            :content="row.note"
            v-if="row.note">
            <el-text style="max-width: 100px" truncated>
              {{ row.note }}
            </el-text>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="illustrate" label="介绍富文本">
        <template #default="{ row }">
          <el-tooltip
            effect="light"
            raw-content
            :content="row.illustrate"
            style="max-width: 100px !important"
            trigger="click"
            v-if="row.illustrate">
            <el-text style="max-width: 100px" truncated class="cursor-pointer">
              {{ row.illustrate }}
            </el-text>
          </el-tooltip>
        </template>
      </el-table-column>
      <DataTebleColumnTime />
      <el-table-column label="操作">
        <template #default="{ row }">
          <div class="d-flex justify-content-around align-items-center">
            <Icon
              icon="icon-bianji"
              class="cursor-pointer"
              @click="toEditProduct(row)" />
            <Icon
              icon="icon-shuoming"
              class="cursor-pointer text-primary"
              @click="" />
            <Icon
              icon="icon-shanchu"
              class="cursor-pointer text-danger"
              @click="" />
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/修改弹窗 -->
    <A_EDialog
      v-model:A_EVisible="A_EVisible"
      :A_ETitle="A_ETitle"
      :submitForm="submitForm"
      fullscreen
      append-to-body>
      <template #headerBtn>
        <span class="ms-2" v-if="!isAdd">ID: {{ A_EFormData?.id }}</span>
      </template>
      <el-scrollbar
        style="
          height: calc(
            100vh - (var(--el-dialog-padding-primary) * 3) -
              (var(--el-border-width) * 2) - 16px - var(--el-font-size-base)
          ) !important;
        ">
        <el-form
          :model="A_EFormData"
          ref="A_EFormRef"
          label-width="auto"
          :rules="rules"
          v-if="A_EFormData">
          <el-form-item label="商品分类" prop="categoryId">
            <el-tree-select
              v-model="A_EFormData.categoryId"
              :data="categoryTreeSelect"
              placeholder="请选择商品分类"
              clearable />
          </el-form-item>
          <el-form-item label="商品名称" prop="name">
            <el-input
              v-model="A_EFormData.name"
              placeholder="请输入商品名称"
              clearable />
          </el-form-item>
          <el-form-item label="备注" prop="note">
            <el-input
              v-model="A_EFormData.note"
              type="textarea"
              placeholder="请输入备注(选填)"
              clearable />
          </el-form-item>
          <div class="d-flex align-items-center justify-content-between">
            <el-form-item label="商品封面" prop="imageUrl">
              <el-image
                fit="cover"
                style="width: 100px; height: 100px"
                :src="A_EFirstImgUrl"
                :preview-src-list="A_EFirstImgPreviewSrcList"
                :preview-teleported="true"
                class="me-3" />
              <CropperUpload
                ref="cropperUploadRef"
                :uploadApi="allFileUpload"
                v-model:croppedFile="croppedFile"
                :showUploadBtn="false"
                needThumbnail />
            </el-form-item>
            <el-form-item label="运费金额" prop="freightTemplateId">
              <el-input-number
                v-model="A_EFormData.freightTemplateId"
                :min="0"
                :precision="2"
                :step="0.1" />
            </el-form-item>
            <el-form-item label="是否推荐" prop="recommendStatus">
              <el-radio-group v-model="A_EFormData.recommendStatus">
                <el-radio-button :value="0" label="否" />
                <el-radio-button :value="1" label="是" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否处方药" prop="isPrescription">
              <el-radio-group v-model="A_EFormData.isPrescription">
                <el-radio-button :value="0" label="否" />
                <el-radio-button :value="1" label="是" />
              </el-radio-group>
            </el-form-item>
          </div>
          <el-form-item label="药品介绍" prop="illustrate">
            <div class="w-100">
              <QuillEditor
                v-model="A_EFormData.illustrate"
                placeholder="请输入药品介绍(选填)" />
            </div>
          </el-form-item>
          <el-form-item label="详情图片">
            <el-upload
              v-model:file-list="fileList"
              :auto-upload="false"
              multiple
              :accept="IMAGE_FORMATS"
              list-type="picture-card"
              :on-change="handleChange"
              @preview="handlePreview">
              <div
                class="d-flex align-items-center flex-column justify-content-around text-primary">
                <Icon icon="icon-shouye" style="font-size: 5rem" class="my-4" />
                <div>添加图片</div>
              </div>
            </el-upload>
            <el-image-viewer
              v-if="showViewer"
              :url-list="urlList"
              :initial-index="currentIndex"
              @close="showViewer = false" />
          </el-form-item>
          <el-form-item label="属性分类">
            <el-select
              v-model="A_EFormData.attributeCategoryId"
              placeholder="请选择属性分类"
              @change="fetchAttributeList">
              <el-option
                v-for="item in attributeCategoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="规格">
            <div class="w-100 border rounded-4 shadow-sm p-2">
              <div
                v-for="(spec, index) in specificationList"
                :key="spec.id"
                class="d-flex flex-warp align-items-center"
                :class="[
                  index < specificationList.length - 1
                    ? 'border-bottom pb-1 mb-1'
                    : '',
                ]">
                <span class="me-3">{{ spec.name }}：</span>
                <!-- 多选 -->
                <el-checkbox-group
                  v-model="spec.selectedValues"
                  v-if="spec.selectType === 2">
                  <el-checkbox
                    v-for="(value, valueIndex) in spec.valueList"
                    :key="valueIndex"
                    :label="value"
                    :value="value" />
                </el-checkbox-group>
                <!-- 唯一/单选 -->
                <el-radio-group v-model="spec.currentValue" v-else>
                  <el-radio
                    v-for="(value, valueIndex) in spec.valueList"
                    :key="valueIndex"
                    :label="value"
                    :value="value" />
                </el-radio-group>
                <!-- 可以新增 -->
                <el-input
                  v-if="spec.handAddStatus == 1"
                  size="small"
                  placeholder="回车添加选项"
                  v-model="spec.newValue"
                  class="ms-3"
                  style="width: 150px"
                  @keyup.enter="addAttrValue(spec, spec.newValue)">
                  <template #append>
                    <el-button
                      v-if="spec.handAddStatus == 1"
                      size="small"
                      @click="resetValueList(spec)">
                      清除
                    </el-button>
                  </template>
                </el-input>
                <el-button
                  size="small"
                  class="ms-3"
                  @click="clearSelection(spec)">
                  取消选择
                </el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="SKU列表" prop="skuStockList">
            <el-button
              type="primary"
              @click="generateSKUList"
              :disabled="!A_EFormData.attributeCategoryId">
              生成SKU列表
            </el-button>
            <el-table
              :data="A_EFormData.skuStockList"
              v-if="A_EFormData.skuStockList.length"
              table-layout="auto"
              cell-class-name="text-center"
              header-cell-class-name="text-center"
              class="border rounded-4 shadow-sm mt-2">
              <el-table-column label="SKU编码" prop="skuCode" />
              <el-table-column label="价格" prop="price">
                <template #default="{ row }">
                  <el-input-number
                    v-model="row.price"
                    :precision="2"
                    :step="0.1"
                    :min="0" />
                </template>
              </el-table-column>
              <el-table-column
                v-for="(specName, index) in specNames"
                :key="index"
                :label="specName">
                <template #default="{ row }">
                  {{ JSON.parse(row.spData)[specName] }}
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="参数">
            <div class="w-100 border rounded-4 shadow-sm p-2">
              <div
                v-for="(para, index) in parameterList"
                class="d-flex flex-warp align-items-center"
                :class="[
                  index < parameterList.length - 1
                    ? 'border-bottom pb-1 mb-1'
                    : '',
                ]">
                <span class="me-3">{{ para.name }}：</span>
                <!-- 多选 -->
                <el-checkbox-group
                  v-model="para.selectedValues"
                  v-if="para.selectType === 2">
                  <el-checkbox
                    v-for="(value, valueIndex) in para.valueList"
                    :key="valueIndex"
                    :label="value"
                    :value="value" />
                </el-checkbox-group>
                <!-- 唯一/单选 -->
                <el-radio-group v-model="para.currentValue" v-else>
                  <el-radio
                    v-for="(value, valueIndex) in para.valueList"
                    :key="valueIndex"
                    :label="value"
                    :value="value" />
                </el-radio-group>
                <!-- 可以新增 -->
                <el-input
                  v-if="para.handAddStatus == 1"
                  size="small"
                  placeholder="回车添加选项"
                  v-model="para.newValue"
                  class="ms-3"
                  style="width: 150px"
                  @keyup.enter="addAttrValue(para, para.newValue)">
                  <template #append>
                    <el-button
                      v-if="para.handAddStatus == 1"
                      size="small"
                      @click="resetValueList(para)">
                      清除
                    </el-button>
                  </template>
                </el-input>
                <el-button
                  size="small"
                  class="ms-3"
                  @click="clearSelection(para)">
                  取消选择
                </el-button>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </A_EDialog>
  </div>
</template>
<script lang="ts" setup>
  import {
    getAttributeCategoryDetail,
    getAttributeCategoryWithAttr,
  } from "@/api/product/attributeCategory";
  import { getCategoryList } from "@/api/product/category";
  import {
    addProduct,
    editProduct,
    getProductInfo,
    getProductList,
  } from "@/api/product/product";
  import { allFileUpload } from "@/api/upload";
  import { usePaginationStore } from "@/stores/pagination";
  import {
    AttributeItem,
    AttributeItemUsing,
    AttributeValueItem,
  } from "@/types/product/attribute";
  import { AttributeCategoryItem } from "@/types/product/attributeCategory";
  import { ProductItem } from "@/types/product/product";
  import { TreeSelectItem } from "@/types/treeSelect";
  import { debugLog } from "@/utils/debug";
  import { formatTreeSelectByFlat } from "@/utils/formatTreeSelectByFlat";
  import { generateCode } from "@/utils/generateCode";
  import { decodeArray, encodeArray } from "@/utils/arrayToString";
  import {
    ElMessage,
    FormInstance,
    FormRules,
    UploadFile,
    UploadFiles,
    UploadRawFile,
    UploadStatus,
  } from "element-plus";
  import { cloneDeep, debounce } from "lodash";
  import { computed, onMounted, reactive, ref, toRaw, watch } from "vue";

  // 查询参数-----------------------
  const queryParams = reactive<
    Pick<
      ProductItem,
      "name" | "categoryId" | "recommendStatus" | "isPrescription"
    >
  >({
    name: "",
    categoryId: undefined,
    recommendStatus: undefined,
    isPrescription: undefined,
  });
  const currentPage = ref(1);
  const paginationStore = usePaginationStore();
  const total = ref(0);
  const productList = ref<ProductItem[]>([]);

  // 获取药品列表--------------------
  const fetchProductList = async () => {
    const res = await getProductList({
      pageNum: currentPage.value,
      pageSize: paginationStore.pageSize,
      ...queryParams,
    });
    debugLog("药品列表=>", res);
    if (res.code === 200) {
      if (res.rows) productList.value = res.rows;
      if (res.total) total.value = res.total;
    } else ElMessage.error(res.msg || "获取药品列表失败");
  };

  // 监听页码变化
  watch(currentPage, () => {
    fetchProductList();
  });

  // 获取分类选项数据------------------------
  const categoryMap = ref<Map<number, string>>(new Map());
  const categoryTreeSelect = ref<TreeSelectItem[]>([]);

  const fetchCategoryOptions = async () => {
    const res = await getCategoryList({
      pageNum: 1,
      pageSize: 99999,
      status: 1, // 只获取启用状态的分类
    });
    debugLog("全部药品分类列表=>", res);

    if (res.code === 200 && res.rows) {
      res.rows.forEach((category) => {
        if (category.id && category.name)
          categoryMap.value.set(category.id, category.name);
      });
      categoryTreeSelect.value = await formatTreeSelectByFlat({
        flat: res.rows,
        rootLabel: "顶级分类",
        rootValue: 1,
        rootId: 1,
      });
      debugLog("处理后的药品分类树形选单=>", categoryTreeSelect.value);
    } else ElMessage.error(res.msg || "获取分类列表失败");
  };
  onMounted(() => {
    fetchProductList();
    fetchCategoryOptions();
  });

  // 添加/修改弹窗------------------------
  const A_EVisible = ref(false);
  const A_ETitle = ref("");
  const isAdd = ref(true);
  const defaultForm: ProductItem = {
    name: "",
    imageUrl: "",
    miniImg: "",
    freightTemplateId: 0,
    sale: 0,
    note: "",
    recommendStatus: 0,
    isPrescription: 0,
    illustrate: "",
    instructionImagesList: [],
    attributeCategoryId: null,
    productAttributeValueList: [],
    skuStockList: [],
  };
  const rules: FormRules = {
    categoryId: [
      { required: true, message: "请选择商品分类", trigger: "change" },
    ],
    name: [
      { required: true, message: "请输入商品名称", trigger: "blur" },
      { min: 2, max: 50, message: "长度在2-50个字符", trigger: "blur" },
    ],
    imageUrl: [
      {
        required: true,
        validator: (_rule: any, _value: any, callback: any) => {
          if (!croppedFile.value && !A_EFormData.imageUrl) {
            callback(new Error("请上传商品封面"));
          } else callback();
        },
        trigger: "change",
      },
    ],
    freightTemplateId: [
      { required: true, message: "请输入运费金额", trigger: "blur" },
    ],
    skuStockList: [
      {
        required: true,
        validator: (_rule: any, _value: any, callback: any) => {
          if (A_EFormData.skuStockList.length === 0)
            callback(new Error("请添加至少一条商品规格"));
          else callback();
        },
        trigger: "change",
      },
    ],
  };
  const A_EFormData = reactive(cloneDeep(defaultForm));

  // 规格-----------------------------------
  const attributeCategoryList = ref<AttributeCategoryItem[]>([]); //所有属性分类
  const initAttributeCategoryList = async () => {
    const res = await getAttributeCategoryWithAttr();
    debugLog("属性分类列表=>", res);
    attributeCategoryList.value = res.data;
  };
  onMounted(initAttributeCategoryList);
  const attributeList = ref<AttributeItem[]>([]); // 当前分类下的属性
  const fetchAttributeList = async (id: number) => {
    const res = await getAttributeCategoryDetail(id);
    debugLog(`ID:${id}的属性分类详情=>`, res);
    if (res.code === 200 && res.data.length > 0) attributeList.value = res.data;
    initSpecifications();
    initParameters();
  };
  // 获取规格的方法
  const specificationList = ref<AttributeItemUsing[]>([]);
  const initSpecifications = () => {
    specificationList.value = attributeList.value
      .filter((attr) => attr.type === 0)
      .map((attr) => ({
        ...attr,
        newValue: undefined,
        valueList: attr.inputList ? attr.inputList.split(",") : [],
        originalValueList: attr.inputList ? attr.inputList.split(",") : [], // 添加一个用于存储原始值列表的属性
        currentValue: undefined,
        selectedValues: [],
      }));
  };
  // 添加新规格选项/参数选项的方法
  const addAttrValue = (attr: AttributeItemUsing, newValue?: string) => {
    if (newValue && !attr.valueList?.includes(newValue)) {
      attr.valueList?.push(newValue); // 添加到可选列表
      attr.newValue = ""; // 清空输入框
      if (attr.selectType === 1) attr.currentValue = newValue; // 如果是单选，自动选中新值
      if (attr.selectType === 2) attr.selectedValues?.push(newValue); // 如果是多选，自动勾选新值
    }
  };
  // 清除选择
  const clearSelection = (spec: AttributeItemUsing) => {
    if (spec.selectType === 2) spec.selectedValues = []; // 清除多选
    else spec.currentValue = ""; // 清除单选
  };
  // 恢复原始规格选项
  const resetValueList = (spec: AttributeItemUsing) => {
    spec.valueList = [...(spec.originalValueList || [])]; // 使用展开运算符创建新数组
    clearSelection(spec); // 同时清除选择
  };

  // SKU列表--------------------------------
  const generateSKUList = () => {
    // 检查是否有任何规格被选择
    const hasSelectedSpecs = specificationList.value.some((spec) => {
      // 对于唯一规格/单选规格，检查是否有currentValue
      // 对于多选规格，检查selectedValues是否有值
      return (
        (spec.selectType !== 2 && spec.currentValue) ||
        (spec.selectType === 2 &&
          spec.selectedValues &&
          spec.selectedValues.length > 0)
      );
    });

    if (!hasSelectedSpecs) {
      ElMessage.warning("请至少选择一个规格");
      return;
    }

    // 过滤出有选择值的规格
    const selectedSpecs = specificationList.value.filter((spec) => {
      return (
        (spec.selectType !== 2 && spec.currentValue) ||
        (spec.selectType === 2 &&
          spec.selectedValues &&
          spec.selectedValues.length > 0)
      );
    });

    // 生成 SKU 组合
    const specValues = selectedSpecs.map((spec) => {
      if (spec.selectType !== 2)
        return [{ name: spec.name, value: spec.currentValue! }];
      // 唯一规格/单选规格
      else
        return spec.selectedValues!.map((value) => ({
          name: spec.name,
          value,
        })); // 多选规格
    });

    const skuCombinations = cartesianProduct(specValues); //笛卡尔积算法

    // 更新SKU列表
    A_EFormData.skuStockList = skuCombinations.map((combination) => {
      // 构建 spData 字符串
      const spData = JSON.stringify(
        combination.reduce((acc: { [key: string]: string }, item) => {
          acc[item.name] = item.value;
          return acc;
        }, {})
      );

      return {
        skuCode: generateCode(), // 随机生成 SKU 编码
        price: 0, // 默认价格为0
        spData, // 规格数据
      };
    });
    debugLog("生成了SKU列表", toRaw(A_EFormData.skuStockList));
  };
  // 辅助函数：生成笛卡尔积
  const cartesianProduct = <T>(arrays: T[][]): T[][] => {
    if (arrays.length === 0) return []; //空数组
    if (arrays.length === 1) return arrays[0].map((item) => [item]); //一维数组转换为二维数组

    // 使用reduce实现笛卡尔积
    return arrays.reduce(
      (acc, current) =>
        acc.length === 0
          ? current.map((item) => [item])
          : acc.flatMap((combination) =>
              current.map((item) => [...combination, item])
            ),
      [] as T[][]
    );
  };
  // 解析 spData 的所有规格名
  const specNames = computed(() => {
    if (!A_EFormData.skuStockList.length) return [];
    const firstSpData = JSON.parse(A_EFormData.skuStockList[0].spData);
    return Object.keys(firstSpData); // 获取规格字段名
  });

  // 参数列表----------------------------------
  const parameterList = ref<AttributeItemUsing[]>([]);
  const initParameters = async () => {
    parameterList.value = attributeList.value
      .filter((attr) => attr.type === 1)
      .map((attr) => ({
        ...attr,
        newValue: undefined,
        valueList: attr.inputList ? attr.inputList.split(",") : [],
        originalValueList: attr.inputList ? attr.inputList.split(",") : [], // 添加一个用于存储原始值列表的属性
        currentValue: undefined,
        selectedValues: [],
      }));
  };

  // 裁剪图片相关------------------
  const BASEURL = import.meta.env.VITE_APP_API_BASE_URL;
  const croppedFile = ref<File>();
  const A_EFirstImgUrl = computed(() =>
    croppedFile.value
      ? URL.createObjectURL(croppedFile.value)
      : BASEURL + A_EFormData?.miniImg
  );
  const A_EFirstImgPreviewSrcList = computed(() =>
    croppedFile.value
      ? [URL.createObjectURL(croppedFile.value)]
      : [BASEURL + A_EFormData?.imageUrl]
  );

  // 多选图片上传----------------------
  const IMAGE_FORMATS = import.meta.env.VITE_APP_IMAGE_FORMATS;
  const fileList = ref<UploadFile[]>([]);
  const MAX_FILE_SIZE = 3 * 1024 * 1024;
  const MAX_RESOLUTION = 3840;
  // 验证文件------------------
  const validateImage = async (
    status: UploadStatus,
    file: UploadRawFile
  ): Promise<boolean> => {
    if (status === "success") return true;

    // 验证类型
    const allowedFormats = IMAGE_FORMATS.split(",").map((format: string) =>
      format.trim().toLowerCase()
    );
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!allowedFormats.includes(fileExtension)) {
      ElMessage.error(`${file.name} 文件类型不支持，仅支持 ${IMAGE_FORMATS}`);
      return false;
    }

    // 验证大小
    if (file.size > MAX_FILE_SIZE) {
      ElMessage.error(`${file.name} 大小超过${MAX_FILE_SIZE / 1024 / 1024}M`);
      return false;
    }

    // 验证分辨率
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        if (img.width > MAX_RESOLUTION || img.height > MAX_RESOLUTION) {
          ElMessage.error(
            `${file.name} 分辨率超过${MAX_RESOLUTION}*${MAX_RESOLUTION}`
          );
          resolve(false);
        } else resolve(true);
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        ElMessage.error(`${file.name} 图片加载失败`);
        resolve(false);
      };
    });
  };

  // 修改验证函数
  const debouncedValidateFiles = debounce(async (files: UploadFiles) => {
    const validatedFiles: UploadFile[] = [];

    for (const file of files) {
      // 如果是已存在的文件（编辑状态的原有图片），直接保留
      if (file.status === "success") validatedFiles.push(file);
      // 对新上传的文件进行验证
      else if (file.raw) {
        const isValid = await validateImage(file.status, file.raw);
        if (isValid) validatedFiles.push(file);
      }
    }

    fileList.value = validatedFiles;
  }, 100);
  const handleChange = async (_file: UploadFile, files: UploadFiles) => {
    debouncedValidateFiles(files);
  };
  // 处理文件上传
  const instructionImgUpload = async () => {
    if (!fileList) return;

    // 依次上传所有文件
    const uploadPromises = fileList.value.map(async (file, index) => {
      // 如果是已经上传的图片（编辑状态），直接使用现有URL
      if (file.status === "success") {
        return {
          imageUrl: file.url?.replace(BASEURL, "") || "", // 添加空字符串作为默认值,
          sort: index + 1,
        };
      } else if (file.raw) {
        // 新上传的图片需要调用上传接口
        const res = await allFileUpload(file.raw);
        debugLog(`上传${file.name}结果=>`, res);
        if (res.code == 200 && res.fileName) {
          return {
            imageUrl: res.fileName,
            sort: index + 1,
          };
        }
        // 上传失败时返回默认值
        return {
          imageUrl: "",
          sort: index + 1,
        };
      } else return { imageUrl: "", sort: index + 1 };
    });

    // 等待所有文件上传完成
    const results = await Promise.all(uploadPromises);
    // 更新表单数据
    A_EFormData.instructionImagesList = results;
  };

  // 图片预览------------------
  const showViewer = ref(false); // 控制图片预览显示/隐藏
  const currentIndex = ref(0); // 当前预览的图片索引
  const urlList = computed(() => fileList.value.map((file) => file.url || ""));
  const handlePreview = (uploadFile: UploadFile) => {
    const index = fileList.value.findIndex(
      (file) => file.uid === uploadFile.uid
    );
    currentIndex.value = index !== -1 ? index : 0;
    showViewer.value = true;
  };
  const resetA_EformData = () => {
    // 清空表单
    croppedFile.value = undefined;
    Object.assign(A_EFormData, defaultForm);
    fileList.value = [];
    specificationList.value = [];
    parameterList.value = [];
  };
  // 打开添加弹窗------------
  const toAddProduct = async () => {
    A_ETitle.value = "添加药品";
    isAdd.value = true;
    resetA_EformData(); // 清空表单
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
  };

  // 打开编辑弹窗
  const toEditProduct = async (item: ProductItem) => {
    A_ETitle.value = "修改药品";
    isAdd.value = false;
    A_EVisible.value = true;
    A_EFormRef.value?.clearValidate();
    if (!item.id) return;
    resetA_EformData(); //先清空内容，再重新赋值
    Object.assign(A_EFormData, item); //此处合并基础信息
    const res = await getProductInfo(item.id);
    debugLog(`药品${item.name}的补充信息=>`, res);
    if (res.code == 200) {
      A_EFormData.attributeCategoryId =
        res.data.productAttributeCategoryList[0].id;
      await fetchAttributeList(res.data.productAttributeCategoryList[0].id);
      A_EFormData.skuStockList = res.data.skuStockList;

      res.data.productAttributeValueList.forEach((item) => {
        const attributeConfig = attributeList.value.find(
          (attr) => attr.id === item.productAttributeId
        ); // 在attributeList中找到对应的属性配置

        if (!attributeConfig) return;

        const targetList =
          attributeConfig.type === 0 ? specificationList : parameterList; // 根据type分配到对应的列表

        const targetItem = targetList.value.find(
          (spec) => spec.id === item.productAttributeId
        ); // 在目标列表中找到或创建对应项

        if (targetItem) {
          // 5. 根据selectType设置值
          switch (attributeConfig.selectType) {
            case 0: // 唯一值
            case 1: // 单选
              targetItem.currentValue = item.value;
              break;
            case 2: // 多选
              targetItem.selectedValues = decodeArray(item.value);
              break;
          }
        }
      });

      // 处理详情图片列表
      if (res.data.instructionImagesList?.length) {
        fileList.value = res.data.instructionImagesList.map((item, index) => {
          return {
            name: item.imageUrl.split("/").pop() || `img-${index}`,
            url: BASEURL + item.imageUrl,
            uid: index,
            status: "success",
            raw: undefined, // 添加raw属性
          };
        });
        debugLog("详情图片列表", fileList.value);
      }
    }
  };

  // 提交表单-------------------------------
  const A_EFormRef = ref<FormInstance>();
  const cropperUploadRef = ref();
  const submitForm = () => {
    A_EFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        // 如果有裁剪的图片，先上传图片
        if (croppedFile.value) {
          const { croppedRes, thumbnailRes } =
            await cropperUploadRef.value.handleUpload();

          if (!croppedRes || croppedRes.code !== 200) {
            ElMessage.error("封面图片上传失败");
            return;
          }

          A_EFormData.imageUrl = croppedRes.fileName;
          if (thumbnailRes?.code === 200)
            A_EFormData.miniImg = thumbnailRes.fileName;
        }
        // 如果有详情图片,先上传详情图片
        await instructionImgUpload();

        // 合并规格和参数列表中的所有属性值
        const attributeValues: AttributeValueItem[] = [];
        // 处理规格列表
        specificationList.value.forEach((spec) => {
          if (spec.currentValue)
            attributeValues.push({
              productAttributeId: spec.id,
              value: spec.currentValue,
            });
          if (spec.selectedValues && spec.selectedValues.length > 0)
            attributeValues.push({
              productAttributeId: spec.id,
              value: encodeArray(spec.selectedValues),
            });
        });
        // 处理参数列表
        parameterList.value.forEach((param) => {
          if (param.currentValue)
            attributeValues.push({
              productAttributeId: param.id,
              value: param.currentValue,
            });
          if (param.selectedValues && param.selectedValues.length > 0)
            attributeValues.push({
              productAttributeId: param.id,
              value: encodeArray(param.selectedValues),
            });
        });
        A_EFormData.productAttributeValueList = attributeValues;

        const res = isAdd.value
          ? await addProduct({ ...A_EFormData, delFlag: 0 })
          : await editProduct(A_EFormData.id!, A_EFormData);
        debugLog("药品添加结果=>", res);

        if (res.code === 200) {
          A_EVisible.value = false;
          ElMessage.success(`${A_ETitle.value}成功`);
          fetchProductList(); // 刷新列表
        } else ElMessage.error(res.msg || `${A_ETitle.value}失败`);
      }
    });
  };
</script>
