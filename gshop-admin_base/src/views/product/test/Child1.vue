<template>
  <div class="box">
    <h4>Child1组件</h4>
    <button @click="clickHandler($event, 88)">点击按钮触发自定义事件</button>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits(['qwer'])
console.log(emits)


const clickHandler = (e) => {
  console.log(e)

  emits('qwer', 25)

}
</script>

<style scoped>

</style>