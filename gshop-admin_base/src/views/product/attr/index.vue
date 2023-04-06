<template>
  <div>
    <el-card class="mb-10">
      <CategorySelector :disabled="isEdit"></CategorySelector>
    </el-card>
    <el-card>
      <!-- 列表展示 -->
      <div v-if="!isEdit">
        <el-button type="primary" class="mb-10" :icon="Plus" @click="isEdit = true"
          :disabled="!categoryStore.category3Id">添加属性</el-button>
  
        <el-table :data="attrList" border>
          <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
          <el-table-column label="属性名" width="160" prop="attrName"></el-table-column>
          <el-table-column label="属性值列表">
            <template #default="{ row, $index }">
              <el-tag v-for="val in row.attrValueList" :key="val.id" type="success" class="mr-5">{{ val.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template #default="{ row, $index }">
              <el-button type="warning" size="small" :icon="Edit" @click="editAttr(row)"></el-button>

              <el-popconfirm :title="`确认要删除[${ row.attrName }]吗?`" @confirm="deleteAttr(row)">
                <template #reference>
                  <el-button type="danger" size="small" :icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 新增编辑 -->
      <div v-else>
        <el-form inline>
          <el-form-item label="属性名">
            <el-input v-model="attrForm.attrName" placeholder="输入属性名"></el-input>
          </el-form-item>
        </el-form>

        <div class="mb-10">
          <el-button type="primary" @click="addAttrValue" :disabled="!attrForm.attrName">添加属性值</el-button>
          <el-button @click="cancelSave">取消</el-button>
        </div>

        <el-table :data="attrForm.attrValueList" border class="mb-10">
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column label="属性值名称">

            <template #default="{ row, $index }">
              <el-input
                ref="inputRef"
                v-if="row.inputVisible"
                v-model="row.valueName"
                size="small"
                @blur="inputBlur(row, $index)"
              ></el-input>
              <div v-else @click="clickHandler(row)">{{ row.valueName }}</div>
            </template>

          </el-table-column>
          <el-table-column label="操作" width="80">
            <template #default="{ row, $index }">
              
              <el-popconfirm :title="`确认要删除[${ row.valueName }]吗?`" @confirm="deleteAttrValue($index)">
                <template #reference>
                  <el-button type="danger" size="small" :icon="Delete"></el-button>
                </template>
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" @click="onSave" :disabled="!(attrForm.attrName && attrForm.attrValueList.length)">保存</el-button>
        <el-button @click="cancelSave">取消</el-button>
      </div>
    </el-card>
    
  </div>
</template>

<script setup lang="ts">
// 按道理来说应该先搭静态
// 但是我们这个页面分为上下两块内容
// 上面的三级分类组件是一个通用组件,全局注册的
// 下面才是我们的主体内容
// 先封装三级分类组件,在写页面
// 一、三级分类
//    详细笔记在三级分类组件内容查看
// 二、主体内容
// 1. 静态搭建
// 2. 初始化数据展示
//    api准备
//    页面初始化的时候调api(--- 咱们这里的步骤是需要监听三级分类数据的变化去请求,三级分类有值才要请求数据,三级分类没有值,要清空列表数据)
// 3. 交互
//    3.1 新增
//        3.1.1 点击"新增"按钮,主体内容切换成新增编辑界面(使用一个布尔值进行控制)
//        3.1.2 先搭建静态页面
//        3.1.3 准备api - 目的是为了让我们知道收集什么数据
//        3.1.4 收集数据
//              属性名直接v-model双向绑定收集即可
//              属性值收集:
//                    当点击"添加属性值"按钮的时候,此时属性值数组(attrForm.attrValueList)应该增加一条数据
//                    同时这个数组需要展示在表格之中(attrForm.attrValueList)
//                    目前这里不考虑input输入,直接写死这个数据
//                  当点击属性值表格中"删除"按钮的时候,此时应该让属性值数组删除一条数据(attrForm.attrValueList)
//        3.1.5 保存
//              点击"保存"按钮,组装数据(接口需要的数据),发送请求
//    3.2 增加限制条件
//        3.2.1 新增按钮 - 当有三级分类的时候允许点击"添加"按钮,否则禁用
//            <el-button :disabled="!categoryStore.category3Id">添加属性</el-button>
//        3.2.2 在新增编辑状态下,三级分类是禁用状态
//            三级分类组件内部
//              <el-form inline :disabled="disabled">
//            调用组件的时候
//              <CategorySelector :disabled="isEdit"></CategorySelector>
//            关于defineProps加TS类型的写法: (尖括号中的大括号是interface)
//            const props = defineProps<{
//              disabled: boolean
//            }>()
//        3.2.3 新增编辑界面 - 添加属性值按钮限制条件
//            当有属性名的时候才能点击"添加属性值"按钮
//            <el-button type="primary" @click="addAttrValue" :disabled="!attrForm.attrName">添加属性值</el-button>
//        3.2.4 新增编辑界面 - 保存按钮
//            当属性名有值,且属性值列表有值的时候,才能点击
//            <el-button type="primary" @click="onSave" :disabled="!(attrForm.attrName && attrForm.attrValueList.length)">保存</el-button>
//    3.3 修改
//        点击"编辑"按钮,回显数据,切换界面
//        编辑保存的接口和新增的接口使用的是用一个接口,所以不用改其他内容
//    3.4 删除
import { Delete, Edit, Plus } from '@element-plus/icons-vue';
import { nextTick, ref, watch } from 'vue'
import useCategoryStore from '@/stores/category';
import attrApi, { type AttrModel } from '@/api/attr'
import { ElMessage } from 'element-plus';
import { cloneDeep } from 'lodash';
import type { AttrValueModel } from '@/api/attr';
const categoryStore = useCategoryStore()



// const isShow = ref(false) // 是否展示input框 // 用一个布尔值控制input的显示和隐藏不行,因为所有的行都会用这一个变量
// 应该是每一行用一个布尔值控制input的显示隐藏,多一行,就是多一个row,每个row上面可以帮一个布尔值
// 自动聚焦
const clickHandler = (row: AttrValueModel) => {
  row.inputVisible = true // 让input框展示
  nextTick(() => {
    inputRef.value?.focus()
  })
}
// input失焦
const inputBlur = (row: AttrValueModel, index: number) => {
  row.inputVisible = false // 切换input的显示隐藏
  // 需要校验输入的内容
  // 为空校验
  if (!row.valueName.trim()) {
    attrForm.value.attrValueList.splice(index, 1)
    return
  }
  // 重复判断
  const isRepeat = attrForm.value.attrValueList.some((item, idx) => {
    if (index == idx) { // 把自己排除掉
      return false
    }
    return item.valueName == row.valueName
  })

  if (isRepeat) {
    ElMessage.error('输入的属性值重复,请重试')
    attrForm.value.attrValueList.splice(index, 1)
    return
  }
}




// 编辑
const editAttr = (row: AttrModel) => {
  isEdit.value = true
  attrForm.value = cloneDeep(row) // 回显数据需要深拷贝
}


// 删除
const deleteAttr = async (row: AttrModel) => {
  try {
    await attrApi.deleteAttr(row.id as number)
    ElMessage.success('删除成功')
    getList()
  } catch (error) {
    ElMessage.error('删除失败,请重试')
  }
}




const isEdit = ref(false)
// 新增
const initAttrForm = () => ({ // 抽离成函数的目的是为了后面可能会重置当前attrForm的数据
  attrName: '',
  attrValueList: [],
  categoryId: undefined, // 这个数据在保存之前进行组装即可,目前放undefined
  categoryLevel: 3 // 这个写死,就是3级分类,没有2级和1级
})
const attrForm = ref<AttrModel>(initAttrForm())
const inputRef = ref<HTMLInputElement>() // HTMLInputElement 这个是input标签DOM对象的类型
// 添加属性值
const addAttrValue = () => {
  // 这里新增的属性值应该是input框输入的内容,现在不做,先写死
  attrForm.value.attrValueList.push({
    valueName: ``,
    inputVisible: true
  })

  // DOM更新是异步的,当设置inputVisible为true的时候,此时要显示input框,如果立刻获取的话是获取不到的,需要等待DOM的更新
  // DOM更新完毕之后才能拿到DOM
  nextTick(() => {
    inputRef.value?.focus()
  })
}
// 删除属性值
const deleteAttrValue = (index: number) => {
  attrForm.value.attrValueList.splice(index, 1)
}

// 保存
const onSave = async () => {
  // 组装数据
  attrForm.value.categoryId = categoryStore.category3Id
  // 发送请求
  try {
    await attrApi.saveAttrInfo(attrForm.value)
    ElMessage.success('保存成功') // 给个提示
    isEdit.value = false // 切换到主列表展示
    getList() // 重新获取列表数据
    attrForm.value = initAttrForm() // 重置收集的数据变量
  } catch (error) {
    ElMessage.error('保存失败')
  }
}
// 取消保存
const cancelSave = () => {
  isEdit.value = false // 切换到主列表
  attrForm.value = initAttrForm()  // 重置收集的数据变量
}




// 展示列表
const attrList = ref<AttrModel[]>([])
const getList = async () => {
  try {
    const { category1Id, category2Id, category3Id } = categoryStore;
    let result = await attrApi.getList(category1Id as number, category2Id as number, category3Id as number)
    attrList.value = result;
  } catch (error) {
    ElMessage.error('获取平台属性数据失败,请重试')    
  }
}

// watch监听,参数一不能直接放一个常量(基本数据类型),如果想要监听基本数据类型的时候,需要用函数返回值的形式
watch(() => categoryStore.category3Id, (nval, oval) => {
  if (nval) { // 发请求拿数据
    getList()
  } else { // 清空数据
    attrList.value = []
  }
}, { immediate: true })
</script>

<style scoped>

</style>