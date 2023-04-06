<template>
  <div>
    <el-button type="primary" :icon="Plus" @click="addSpu" class="mb-10">新增SPU</el-button>
    <!-- <el-button type="primary" @click="addSku">新增SKU</el-button> -->

    <el-table :data="spuList" border class="mb-10">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column label="SPU名称" prop="spuName"></el-table-column>
      <el-table-column label="SPU描述" prop="description"></el-table-column>
      <el-table-column label="操作" width="240">
        <template #default="{ row, $index }">
          <el-button type="success" size="small" :icon="Plus"></el-button>
          <el-button type="warning" size="small" :icon="Edit"></el-button>
          <el-button type="info" size="small" :icon="InfoFilled"></el-button>
          <el-button type="danger" size="small" :icon="Delete"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="page"
      v-model:page-size="limit"
      :total="total"
      :page-sizes="[3, 5, 7, 10]"
      layout="prev, pager, next, jumper, -> , sizes, total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    
  </div>
</template>

<script setup lang="ts">
import { Delete, Edit, InfoFilled, Plus } from '@element-plus/icons-vue'
import { STATUS } from '../../index.vue'
import { ref, watch } from 'vue'
import spuApi, { type SpuModel } from '@/api/spu'
import useCategoryStore from '@/stores/category'
import { ElMessage } from 'element-plus'
const categoryStore = useCategoryStore()
interface EmitsModel {
  // 参数一: 规定a的类型,是一个值得类型
  // 参数二: 规定了n的类型,是一个number类型
  // : void 规定的是返回值的类型
  (a: 'update:modelValue', n: number): void
}
const emits = defineEmits<EmitsModel>()

// 新增SPU
const addSpu = () => {
  emits('update:modelValue', STATUS.SPUFORM)
}

// 新增SKU
const addSku = () => {
  emits('update:modelValue', STATUS.SKUFORM)
}


// 分页
const page = ref(1)
const limit = ref(3)
const total = ref(0)

const handleSizeChange = (val: number) => {
  // 组装数据
  limit.value = val
  // 发送请求
  getPage()
}
const handleCurrentChange = (val: number) => {
  // 组装数据
  page.value = val
  // 发送请求
  getPage()
}


const spuList = ref<SpuModel[]>()
const getPage = async () => {
  try {
    let result = await spuApi.getPage(page.value, limit.value, categoryStore.category3Id as number)
    spuList.value = result.records

    total.value = result.total
  } catch (error) {
    ElMessage.error('获取SPU分页数据失败,请重试')
  }
}

// 初始化数据展示
watch(() => categoryStore.category3Id, (nval, oval) => {
  if (nval) { // 发送请求
    getPage()
  } else { // 清空数据
    spuList.value = []
  }
}, { immediate: true })
</script>

<style scoped>

</style>