<template>
  <div>
    <el-button
      type="primary"
      :icon="Plus"
      @click="addSpu"
      class="mb-10"
      :disabled="!categoryStore.category3Id"
    >新增SPU</el-button>

    <el-table :data="spuList" border class="mb-10">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column label="SPU名称" prop="spuName"></el-table-column>
      <el-table-column label="SPU描述" prop="description"></el-table-column>
      <el-table-column label="操作" width="240">
        <template #default="{ row, $index }">
          <el-button type="success" size="small" :icon="Plus" title="添加SKU" @click="addSku(row)"></el-button>
          <el-button type="warning" size="small" :icon="Edit" @click="editSpu(row)" title="编辑SPU"></el-button>
          <el-button type="info" size="small" :icon="InfoFilled" title="查看SKU列表" @click="showSkuList(row)"></el-button>
          
          <el-popconfirm :title="`确定要删除[${ row.spuName }]吗?`" @confirm="deleteSpu(row)">
            <template #reference>
              <el-button type="danger" size="small" :icon="Delete" title="删除SPU"></el-button>
            </template>
          </el-popconfirm>
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

    <el-dialog
      v-model="dialogVisible"
      :title="`[${dialogTitle}]的sku列表`"
      width="80%"
      @close="skuList = []"
    >
      <el-table :data="skuList" size="small" v-loading="isLoading">
        <el-table-column label="名称" prop="skuName"/>
        <el-table-column label="价格" prop="price"/>
        <el-table-column label="重量" prop="weight"/>
        <el-table-column label="图片">
          <template #default="{ row, $index }">
            <img :src="row.skuDefaultImg" style="width: 60px;height: 60px;">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    
  </div>
</template>

<script setup lang="ts">
import { Delete, Edit, InfoFilled, Plus } from '@element-plus/icons-vue'
import { STATUS } from '../../index.vue'
import { ref, watch } from 'vue'
import spuApi, { type SpuModel } from '@/api/spu'
import skuApi from '@/api/sku'
import useCategoryStore from '@/stores/category'
import { ElMessage } from 'element-plus'
import type { SkuModel } from '@/api/sku'
const categoryStore = useCategoryStore()
interface EmitsModel {
  // 参数一: 规定a的类型,是一个值得类型
  // 参数二: 规定了n的类型,是一个number类型
  // : void 规定的是返回值的类型
  (a: 'update:modelValue', n: number): void,
  (e: 'spuInfo', row: SpuModel): void
}
const emits = defineEmits<EmitsModel>()

// 新增SPU
const addSpu = () => {
  emits('update:modelValue', STATUS.SPUFORM)
}

// 编辑
const editSpu = (row: SpuModel) => {
  emits('update:modelValue', STATUS.SPUFORM) // 切换spuform
  emits('spuInfo', row) // 数据传递给父组件
}

// 删除
const deleteSpu = async (row: SpuModel) => {
  try {
    await spuApi.deleteSpu(row.id!)
    ElMessage.success('删除成功')
    getPage() // 重新获取数据
  } catch (error) {
    ElMessage.error('删除失败,请重试')
  }
}


// 新增SKU
const addSku = (row: SpuModel) => {
  emits('spuInfo', row)
  emits('update:modelValue', STATUS.SKUFORM)
}

// 查看SKU列表
const dialogTitle = ref('')
const dialogVisible = ref(false)
const skuList = ref<SkuModel[]>([]) // 存储列表展示数据
const isLoading = ref(false)
const showSkuList = async (row: SpuModel) => {
  dialogVisible.value = true
  dialogTitle.value = row.spuName
  isLoading.value = true;
  try {
    let result = await skuApi.findBySpuId(row.id!)
    skuList.value = result;
  } catch (error) {
    ElMessage.error('获取sku列表数据失败,请重试')
  } finally {
    isLoading.value = false;
  }
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