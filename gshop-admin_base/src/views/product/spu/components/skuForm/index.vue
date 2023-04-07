<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      {{ spuInfo.spuName }}
    </el-form-item>

    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称"></el-input>
    </el-form-item>

    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)"></el-input>
    </el-form-item>

    <el-form-item label="重量(千克)">
      <el-input placeholder="重量(千克)"></el-input>
    </el-form-item>

    <el-form-item label="规格描述">
      <el-input type="textarea" placeholder="规格描述" :rows="3"></el-input>
    </el-form-item>

    <el-form-item label="平台属性">

      <el-form inline>
        <el-form-item :label="attr.attrName" v-for="attr in attrList" :key="attr.id">
          <el-select>
            <el-option
              v-for="attrValue in attr.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
              :value="attrValue.id!"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="销售属性">

      <el-form inline>
        <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in saleAttrList" :key="saleAttr.id">
          <el-select>
            <el-option
              v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
              :value="saleAttrValue.id!"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

    </el-form-item>

    <el-form-item label="图片列表">
      <el-table :data="imgList" border size="small">
        <el-table-column type="selection" width="80" align="center"></el-table-column>
        <el-table-column label="图片">
          <template #default="{ row, $index }">
            <img :src="row.imgUrl" style="width: 60px;height: 60px;">
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row, $index }">
            <el-button type="primary">设为默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  

    <el-form-item>
      <el-button type="primary">保存</el-button>
      <el-button @click="cancelSave">取消</el-button>
    </el-form-item>
  </el-form>  
</template>

<script setup lang="ts">
// 新增SKU
// 1. 进入新增SKU页面需要把spu的数据传过来,因为要展示当前的spuName
//    先将list页面的row(一条spu)传给父组件,再由父组件传给skuform组件
// 2. 静态搭建
// 3. 初始化数据展示
//    平台属性下拉初始化
//    销售属性下拉初始化
//    图片列表表格初始化
// 4. api准备 - 知道收集的数据格式
// 5. 收集数据
//    点击"保存"组装数据,发送请求
import attrApi, { type AttrModel } from '@/api/attr'
import spuApi, { type SpuModel, type SpuSaleAttrModel, type SpuImageModel } from '@/api/spu';
import { STATUS } from '../../index.vue'
import { onMounted, ref } from 'vue';
import useCategoryStore from '@/stores/category';
import { ElMessage } from 'element-plus';
const categoryStore = useCategoryStore()
// const emits = defineEmits(['update:modelValue'])
const emits = defineEmits<{
  (e: 'update:modelValue', n: number): void
}>()
const props = defineProps<{
  spuInfo: SpuModel
}>()

const cancelSave = () => {
  emits('update:modelValue', STATUS.SPULIST)
}


// 获取平台属性下拉
const attrList = ref<AttrModel[]>([])
const getAttrList = async () => {
  const { category1Id, category2Id, category3Id } = categoryStore
  try {
    let result = await attrApi.getList(category1Id!, category2Id!, category3Id!)
    console.log('平台属性', result)
    attrList.value = result;
  } catch (error) {
    ElMessage.error('获取平台属性数据失败,请重试')
  }
}
// 获取销售属性下拉
const saleAttrList = ref<SpuSaleAttrModel[]>([])
const getSaleAttrListBySpuId = async () => {
  try {
    let result = await spuApi.getSaleAttrListBySpuId(props.spuInfo.id!)
    console.log('销售属性', result)
    saleAttrList.value = result
  } catch (error) {
    ElMessage.error('获取销售属性数据失败,请重试')
  }
}
// 获取图片列表
const imgList = ref<SpuImageModel[]>([])
const getSpuImageListBySpuId = async () => {
  try {
    let result = await spuApi.getSpuImageListBySpuId(props.spuInfo.id!)
    console.log('图片列表', result)
    imgList.value = result
  } catch (error) {
    ElMessage.error('获取图片列表数据失败,请重试')
  }
}


onMounted(() => {
  getAttrList()
  getSaleAttrListBySpuId()
  getSpuImageListBySpuId()
})
</script>

<style scoped>

</style>