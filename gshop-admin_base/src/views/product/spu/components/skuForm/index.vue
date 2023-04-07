<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      {{ spuInfo.spuName }}
    </el-form-item>

    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuForm.skuName"></el-input>
    </el-form-item>

    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)" v-model="skuForm.price"></el-input>
    </el-form-item>

    <el-form-item label="重量(千克)">
      <el-input placeholder="重量(千克)" v-model="skuForm.weight"></el-input>
    </el-form-item>

    <el-form-item label="规格描述">
      <el-input type="textarea" placeholder="规格描述" :rows="3" v-model="skuForm.skuDesc"></el-input>
    </el-form-item>

    <el-form-item label="平台属性">
      <el-form inline>
        <el-form-item :label="attr.attrName" v-for="attr in attrList" :key="attr.id">
          <el-select v-model="attr.attrIdValueId" clearable>
            <el-option
              v-for="attrValue in attr.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
              :value="`${attr.id}:${attrValue.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="销售属性">

      <el-form inline>
        <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in saleAttrList" :key="saleAttr.id">
          <el-select v-model="saleAttr.attrIdValueId" clearable>
            <el-option
              v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
              :value="`${saleAttr.id}:${saleAttrValue.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

    </el-form-item>

    <el-form-item label="图片列表">
      <el-table :data="imgList" border size="small" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="80" align="center"></el-table-column>
        <el-table-column label="图片">
          <template #default="{ row, $index }">
            <img :src="row.imgUrl" style="width: 60px;height: 60px;">
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row, $index }">
            <el-tag v-if="row.isDefault == '1'" type="success" size="small">默认</el-tag>
            <el-button v-else type="primary" size="small" @click="setDefaultImg(row)">设为默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  

    <el-form-item>
      <el-button type="primary" @click="onSave">保存</el-button>
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
//    5.1 收集普通数据 - 使用v-model收集
//    5.2 收集销售属性和平台属性
//        平台属性和销售属性都是循环出来的,不能使用一个变量收集数据,每一个下拉框都应该可以收集数据
//        给每一个循环的销售属性和平台属性都绑定一个 attrIdValueId 进行收集
//        下拉框里面的值(也就是el-option组件的value值)是拼接的, `attrId:valuId`
//        注意: 这里仅仅是收集到数据,再保存之间组转数据即可
//    5.3 图集图片列表
//        表格选中有事件 @selection-change="handleSelectionChange"
//        回调的参数就是选中的表格数据,也就是选中的图片列表,直接赋值即可
//    5.4 默认图片收集
//        排他思想
//        图片列表中的所有图片isDefault为0,点击的这一张图片isDefault为1 
//    5.5 点击"保存"
//        组装数据,发送请求
//        切换主列表显示,同时需要把父级的spuInfo清除掉
//            如果不清除,父级的spuInfo还存在,再次点击添加spu的时候,会把这个spuInfo传给spuform组件,此时就变成了编辑
import skuApi, { type SkuModel } from '@/api/sku'
import attrApi, { type AttrModel } from '@/api/attr'
import spuApi, { type SpuModel, type SpuSaleAttrModel, type SpuImageModel } from '@/api/spu';
import { STATUS } from '../../index.vue'
import { onMounted, ref, watch } from 'vue';
import useCategoryStore from '@/stores/category';
import { ElMessage } from 'element-plus';
const categoryStore = useCategoryStore()
// const emits = defineEmits(['update:modelValue'])
const emits = defineEmits<{
  (e: 'update:modelValue', n: number): void,
  (e: 'spuInfo'): void
}>()
const props = defineProps<{
  spuInfo: SpuModel
}>()

// 取消保存
const cancelSave = () => {
  emits('spuInfo')
  emits('update:modelValue', STATUS.SPULIST)
}
// 保存
const onSave = async () => {
  // 组装数据
  // 外部组装的数据
  skuForm.value.spuId = props.spuInfo.id
  skuForm.value.tmId = props.spuInfo.tmId
  skuForm.value.category3Id = categoryStore.category3Id
  // 平台属性和销售属性数据组装
  skuForm.value.skuAttrValueList = attrList.value.filter(item => item.attrIdValueId).map(item => {
    const [attrId, valueId] = item.attrIdValueId?.split(':')!
    return {
      attrId,
      valueId
    }
  })
  skuForm.value.skuSaleAttrValueList = saleAttrList.value.filter(item => item.attrIdValueId).map(item => {
    const [saleAttrId, saleAttrValueId] = item.attrIdValueId?.split(':')!
    return {
      saleAttrId,
      saleAttrValueId
    }
  })
  // 图片列表再选择到图片的时候已经组装了,这里组装默认图片即可
  skuForm.value.skuDefaultImg = imgList.value.find(item => item.isDefault == '1')?.imgUrl!

  // 简单校验
  const {
    spuId,
    tmId,
    category3Id,
    price,
    skuName,
    skuDesc,
    weight,
    skuDefaultImg,
    skuImageList,
    skuAttrValueList,
    skuSaleAttrValueList,
  } = skuForm.value
  
  if (
    !(spuId &&
    tmId &&
    category3Id &&
    price &&
    skuName &&
    skuDesc &&
    weight &&
    skuDefaultImg &&
    skuImageList.length &&
    skuAttrValueList.length &&
    skuSaleAttrValueList.length)
  ) {
    ElMessage.error('请输入完整数据')
    return
  }

  // 发送请求
  try {
    await skuApi.save(skuForm.value)
    ElMessage.success('保存成功')
    cancelSave()
  } catch (error) {
    ElMessage.success('保存失败,请重试')
  }
}


const initSkuForm = (): SkuModel => ({
  spuId: undefined,
  tmId: undefined,
  category3Id: undefined,
  price: '',
  skuName: '',
  skuDesc: '',
  weight: '',
  skuDefaultImg: '',
  createTime: '',
  skuImageList: [],
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
})
const skuForm = ref<SkuModel>(initSkuForm())

// 图片列表收集
const handleSelectionChange = (val: SpuImageModel[]) => {
  skuForm.value.skuImageList = val
}
// 收集默认图片
const setDefaultImg = (row: SpuImageModel) => {
  imgList.value.forEach(item => item.isDefault = '0')
  row.isDefault = '1'
}


// 获取平台属性下拉
const attrList = ref<AttrModel[]>([])
const getAttrList = async () => {
  const { category1Id, category2Id, category3Id } = categoryStore
  try {
    let result = await attrApi.getList(category1Id!, category2Id!, category3Id!)
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