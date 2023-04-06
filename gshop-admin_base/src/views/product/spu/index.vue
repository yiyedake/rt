<template>
  <div>
    <el-card class="mb-10">
      <CategorySelector :disabled="status != STATUS.SPULIST"></CategorySelector>
    </el-card>
    <el-card>
      <SpuList v-if="status == STATUS.SPULIST" v-model="status"></SpuList>
      <SpuForm v-if="status == STATUS.SPUFORM" v-model="status"></SpuForm>
      <SkuForm v-if="status == STATUS.SKUFORM" v-model="status"></SkuForm>
    </el-card>
  </div>
</template>


<script lang="ts">
export enum STATUS {
  SPULIST = 100,
  SPUFORM = 200,
  SKUFORM = 300
}
</script>
<script setup lang="ts">
// 页面分为上下两块内容
// 上面是三级分类(直接拿过来用)、下面是主体内容
// 下面内容:
// 1. 搭建整体框架
//    第二版:
//    v-model的使用
//        vue3中v-model的实现是两个条件  :xxx 和 update:xxx (当xxx是 modelValue的时候 v-model 指令是可以简写的)
//        :xxx的作用是 父组件传给子组件数据,子组件拿着数据进行展示
//        update:xxx 是自定义事件,用来子组件修改父组件数据
//        我们这里使用的v-model只实现了 update:xxx 这个条件,但是也能用,因为子组件不需要展示该数据
//    枚举的使用
//        目的是为了所有用到该常量的位置后期不用再次修改
// 2. 主列表界面
//    2.1 静态搭建
//    2.2 初始化数据展示
//        api准备
//        页面监听三级分类数据,如果三级分类有数据的话,调用api获取数据,展示
//                           如果没有三级分类数据,清空数据列表
//    2.3 分页迥乎
// 3. 新增SPU界面 - 详情参见 spuform组件注释
import SpuList from './components/spuList/index.vue'
import SpuForm from './components/spuForm/index.vue'
import SkuForm from './components/skuForm/index.vue'
import { ref } from 'vue';

const status = ref(STATUS.SPULIST)

// const changeStatus = (n: number) => {
//   status.value = n
// }
</script>

<style scoped>

</style>