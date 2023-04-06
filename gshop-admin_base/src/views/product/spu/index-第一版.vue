<template>
  <div>
    <el-card class="mb-10">
      <CategorySelector :disabled="status != 1"></CategorySelector>
    </el-card>
    <el-card>
      <SpuList v-if="status == 1" @changeStatus="status = $event"></SpuList>
      <SpuForm v-if="status == 2" @changeStatus="status = $event"></SpuForm>
      <SkuForm v-if="status == 3" @changeStatus="status = $event"></SkuForm>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 页面分为上下两块内容
// 上面是三级分类(直接拿过来用)、下面是主体内容
// 下面内容:
// 1. 搭建整体框架
import SpuList from './components/spuList/index.vue'
import SpuForm from './components/spuForm/index.vue'
import SkuForm from './components/skuForm/index.vue'
import { ref } from 'vue';

const status = ref(1)

// const changeStatus = (n: number) => {
//   status.value = n
// }
</script>

<style scoped>

</style>