<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input v-model="spuForm.spuName" placeholder="SPU名称"></el-input>
    </el-form-item>

    <el-form-item label="品牌">
      <el-select v-model="spuForm.tmId">
        <el-option
          v-for="tm in tmList"
          :key="tm.id"
          :label="tm.tmName"
          :value="(tm.id as number)"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="SPU描述">
      <el-input v-model="spuForm.description" type="textarea" rows="3" placeholder="SPU描述"></el-input>
    </el-form-item>

    <el-form-item label="SPU图片">
      <el-upload
        v-model:file-list="(spuImageList as any)"
        :action="action"
        list-type="picture-card"
        :on-success="handleSuccess"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </el-form-item>

    <el-form-item label="销售属性">
      <div class="mb-10">
        <el-select v-model="saleAttrIdName" :placeholder="`还有${ saleAttrList.length }个未选择`" class="mr-10">
          <el-option
            v-for="saleAttr in saleAttrList"
            :key="saleAttr.id"
            :label="saleAttr.name"
            :value="`${saleAttr.id}:${saleAttr.name}`"
          ></el-option>
        </el-select>
        <el-button type="primary" @click="addSaleAttr">添加销售属性</el-button>
      </div>
      <el-table :data="spuForm.spuSaleAttrList" border size="small">
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column label="属性名" width="200" prop="saleAttrName"></el-table-column>
        <el-table-column label="属性值名称列表"></el-table-column>
        <el-table-column label="操作" width="80">
          <template #default="{ row, $index }">
            <el-button type="danger" size="small" :icon="Delete" @click="deleteSaleAttr($index)">删除</el-button>
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
// 1. 静态搭建
// 2. 初始化数据展示
//    api准备
//    页面初始化的时候调用api展示数据 - 展示品牌下拉,展示销售属性下拉
// 3. 交互
//    3.1 准备api - 目的:看发送请求的数据有哪些(注意: 这里需要修改SpuModel这个类型)
//    3.2 收集数据
//            3.2.1 普通数据收,直接使用v-model收集即可
//            3.2.2 图片列表收集
//                    (上传成功图片之后,在上传成功的回调中可以直接拿到所有图片的数组列表收集起来即可,在发送数据之前(调用api之前)组装数据)
//                    图片列表用单独的数据去收集,类型是我们自己写的类型 SpuImageModel[]
//                    但是这里会飘红,原因是我们写的类型和element想要的类型不是一个类型
//                    当两个类型不一致的时候,还要强行赋值的时候,可以使用 any 中转一下
//                    收集到图片列表数据之后,在保存之前进行组装即可,组装成后端想要的数据格式
//            3.2.3 收集销售属性
//                  3.2.3.1 收集销售属性
//                  3.2.3.2 收集销售属性值
//    3.3 点击"保存"按钮的时候,报数据传给后端
import { Plus, Delete } from '@element-plus/icons-vue'
import { STATUS } from '../../index.vue'
import { computed, onMounted, ref } from 'vue'
import trademarkApi, { type TrademarkModel } from '@/api/trademark'
import spuApi, { type SaleAttrModel, type SpuModel } from '@/api/spu'
import { ElMessage, type UploadProps, type UploadUserFile } from 'element-plus'
import type { SpuImageModel } from '@/api/spu'
const action = `${ import.meta.env.VITE_API_URL }/admin/product/upload`
// const emits = defineEmits(['update:modelValue'])
const emits = defineEmits<{
(e: 'update:modelValue', n: number): void
}>()

// 取消
const cancelSave = () => {
emits('update:modelValue', STATUS.SPULIST)
}


const initSpuForm = () => ({
category3Id: undefined, // 这个数据在最后保存之前去收集
spuName: '',
description: '',
tmId: undefined,
spuSaleAttrList: [],
spuImageList: []
})
const spuForm = ref<SpuModel>(initSpuForm())


const saleAttrIdName = ref('')
// 收集销售属性
const addSaleAttr = () => {
if (!saleAttrIdName.value) {
  return
}

const [baseSaleAttrId, saleAttrName] = saleAttrIdName.value.split(':');
spuForm.value.spuSaleAttrList.push({
  baseSaleAttrId: Number(baseSaleAttrId),
  saleAttrName,
  spuSaleAttrValueList: [] // 销售属性值列表,一会收集
})

// 销售属性下拉置空
saleAttrIdName.value = ''
}
// 删除销售属性
const deleteSaleAttr = (index: number) => {
spuForm.value.spuSaleAttrList.splice(index, 1)
}






// 图片上传
// 图片列表用单独的数据去收集,类型是我们自己写的类型
// 但是这里会飘红,原因是我们写的类型和element想要的类型不是一个类型
// 当两个类型不一致的时候,还要强行赋值的时候,可以使用 any 中转一下
const spuImageList = ref<SpuImageModel[]>([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
// 上传成功的回调
// response 接口返回的数据 uploadFile 图片的详细信息,里面有图片的name和size和response
const handleSuccess: UploadProps['onSuccess'] = (response, uploadFile, uploadFiles) => {
// response 后端返回的数据
// uploadFile 是上传成功文件的详细信息
// uploadFiles 是一个数组,里面有当前所有的图片列表,每一个成员都是一个 uploadFiles
// 在图片列表数据中需要注意字段是
//      name 图片名称
//      url 上传成功之后的url属性是一个本地的url,真实的url应该从response中去拿
//      response 参数一,接口返回的数据
spuImageList.value = uploadFiles as any
}
// 删除成功的回调
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
spuImageList.value = uploadFiles as any
}
// 预览的回调
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
dialogImageUrl.value = uploadFile.url!
dialogVisible.value = true
}





// 获取品牌下拉数据
const tmList = ref<TrademarkModel[]>([])
const getTrademarkList = async () => {
try {
  let result = await trademarkApi.getTradermarkList()
  tmList.value = result;
} catch (error) {
  ElMessage.error('获取品牌下拉数据失败,请重试')
}
}
// 获取销售下拉数据
const baseSaleAttrList = ref<SaleAttrModel[]>([]) // 原始数据
const saleAttrList = computed(() => {
let res = baseSaleAttrList.value.filter(saleAttr => {

  let isRepaet = spuForm.value.spuSaleAttrList.some(item => {
    return item.baseSaleAttrId == saleAttr.id
  })

  return !isRepaet
})
return res
})
const getBaseSaleAttrList = async () => {
try {
  let result = await spuApi.getBaseSaleAttrList()
  baseSaleAttrList.value = result
} catch (error) {
  ElMessage.error('获取销售属性下拉数据失败,请重试')
}
}

// 页面初始化数据展示
onMounted(() => {
getTrademarkList()
getBaseSaleAttrList()
})




// let a: number = 5;
// let b: number | undefined;
// a = b as number;
// a = b!; // 联合类型中包含具体类型,可以使用!忽略


// let c: string = '我爱你';
// a = c as any; // 强行赋值用any中转

</script>

<style scoped>

</style>