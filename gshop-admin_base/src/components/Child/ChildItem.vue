<template>
  <div class="box">

    <div>{{ item.content }}</div>

    <ChildItem
      v-for="(child, index) in item.children"
      :key="index"
      :item="child"
    ></ChildItem>

  </div>
</template>

<script lang="ts">
export default {
  name: 'ChildItem'
}
</script>

<script setup lang="ts">
const porps = defineProps(['item'])
console.log(porps)
</script>

<style scoped>
.box {
  padding-left: 20px;
}
</style>