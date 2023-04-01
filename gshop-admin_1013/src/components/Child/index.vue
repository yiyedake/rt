<template>
  <div>
    <h2>递归组件示例</h2>

    <ChildItem
      v-for="(item, index) in list"
      :key="index"
      :item="item"
    ></ChildItem>

  </div>
</template>

<script setup lang="ts">
import ChildItem from './ChildItem.vue';
import { ref } from 'vue'
const list = ref([
  {
    id: 1001,
    content: '销售部',
    children: [
      {
        id: 100101,
        content: '赵四'
      },
      {
        id: 100102,
        content: '刘能',
        children: [
          {
            id: 10010201,
            content: '刘英'
          },
          {
            id: 10010202,
            content: '谢大脚'
          },
        ]
      },
    ]
  },
  {
    id: 1002,
    content: '采购部',
    children: [
      {
        id: 100201,
        content: '赵玉田'
      },
    ]
  },
  {
    id: 1003,
    content: '财务部',
  },
])
</script>

<style scoped>

</style>