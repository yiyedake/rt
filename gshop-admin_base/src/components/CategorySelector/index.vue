<template>
  <el-form inline :disabled="disabled">

    <el-form-item label="一级分类">
      <el-select v-model="categoryStore.category1Id" @change="categoryStore.getCategory2List">
        <el-option
          v-for="c1 in categoryStore.category1List"
          :key="c1.id"
          :label="c1.name"
          :value="c1.id"
        ></el-option>
      </el-select>
    </el-form-item>
    
    <el-form-item label="二级分类">
      <el-select v-model="categoryStore.category2Id" @change="categoryStore.getCategory3List">
        <el-option
          v-for="c2 in categoryStore.category2List"
          :key="c2.id"
          :label="c2.name"
          :value="c2.id"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="三级分类">
      <el-select v-model="categoryStore.category3Id">
        <el-option
          v-for="c3 in categoryStore.category3List"
          :key="c3.id"
          :label="c3.name"
          :value="c3.id"
        ></el-option>
      </el-select>
    </el-form-item>

  </el-form>
</template>

<script setup lang="ts">
// 三级分类
// 1. 静态搭建
//    el-form 的 inline 属性是行内表单
// 2. 初始化数据展示
//    注意: 在咱们项目中没有其他地方使用pinia了,需要专门找一个东西使用使用pinia,我们会把 三级分类组件所有相关数据放pinia
//          为了使用pinia而使用pinia
//    2.1 api准备
//    2.2 初始化(mounted)的时候调用api
//    当页面初始化的时候,只拿了一级分类的数据
//    选择完一级分类之后,请求二级分类数据
//    选择完二级分类之后,请求三级分类数据
//    选择完三级分类诸侯,请求页面数据(放一放)
//    和交互混在一块做
// 3. 交互
import { onMounted } from 'vue';
import useCategoryStore from '@/stores/category'
const categoryStore = useCategoryStore()


// 针对TS传参不同,走的方法可以理解为走的不是同一个方法
// 1. 传数组
// const props = defineProps(['disabled'])
// 2. 传对象
// const props = defineProps({
//   disabled: {
//     type: Boolean,
//     required: true
//   }
// })
// const props = defineProps({
//   disabled: boolean
// })
// 3. 不传参,加TS类型
// interface PropsModel {
//   disabled: boolean
// }
// const props = defineProps<PropsModel>()
// console.log(props)
// 简化版本
const props = defineProps<{
  disabled: boolean
}>()

onMounted(() => {
  categoryStore.getCategory1List()
})
</script>

<style scoped>

</style>