<template>
  <div>
    SKUForm-新增SKU
    <el-button @click="cancelSave">取消</el-button>
    
  </div>
</template>

<script setup lang="ts">
import { STATUS } from '../../index.vue'
// const emits = defineEmits(['update:modelValue'])
const emits = defineEmits<{
  (e: 'update:modelValue', n: number): void
}>()

const cancelSave = () => {
  emits('update:modelValue', STATUS.SPULIST)
}
</script>

<style scoped>

</style>