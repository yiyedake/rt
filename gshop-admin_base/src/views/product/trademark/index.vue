<template>
    <el-card class="box-card">
  
      <template #header>
  
        <el-button type="primary" :icon="Plus">添加</el-button>
  
      </template>
  
      <el-table :data="tmList" border class="mb-10">
        <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
        <el-table-column label="品牌名称" prop="tmName"></el-table-column>
        <el-table-column label="品牌LOGO">
          <template #default="{ row, $index }">
            <img :src="row.logoUrl" style="width: 80px;height: 80px;">
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row, $index }">
            <el-button type="warning" :icon="Edit">编辑</el-button>
            <el-button type="danger" :icon="Delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <el-pagination v-model:current-page="page" v-model:page-size="limit" :total="total" :page-sizes="[3, 5, 7, 10]"
        layout="prev, pager, next, jumper, -> , sizes, total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </el-card>
  </template>
  
  <script setup lang="ts">
  // 写页面的步骤:
  // 1. 静态搭建
  //    路由组件    - 定义(创建一个.vue文件)、注册(路由注册)、使用(router-link跳转、router-view渲染)
  //    非路由组件  - 定义(创建一个.vue文件)、注册(全局注册)、使用(引入直接使用)
  //    --------------------------------
  //    咱们这里已经配置过路由了,直接进来搭建静态即可(所有关于数据的内容先放放)
  //    el-table
  //        之前的表格标签table写的是tr是行,而我们组件写的列
  //        每一列需要定义一个表头,通过 el-table-column 的 label 属性定义
  //            type="index" (显示的是序号) 和 type="selection"(显示的是多选框)
  //            prop="tmName" column组件的prop设置的是,当前这一列要展示的某条数据中的具体字段
  //            当列需要自定义内容的时候,需要使用插槽
  //                在插槽中拿到的 row 是当前这一行的数据, $index 拿到的是当前这一行数据的下标
  // 2. 初始化数据展示(渲染数据)
  //    2.1 准备api函数(同时需要写上类型)
  //    2.2 页面初始化的时候调用api,拿到数据进行展示
  // 3. 实现交互
  //    3.1 翻页 - 直接写就行
  //    3.2 新增
  //    3.3 编辑
  //    3.4 删除
  import { Delete, Edit, Plus } from '@element-plus/icons-vue'
  import { ref, onMounted } from 'vue'
  import trademarkApi, { type TrademarkListModel, type TrademarkModel } from '@/api/trademark'
  import { ElMessage } from 'element-plus';
  
  // 分页
  const page = ref(1)
  const limit = ref(3)
  const total = ref(0) // 不能写und,否则会报警告
  const handleSizeChange = (val: number) => { // 每页条数改变的回调
    // 组装数据
    limit.value = val
    // 发送请求
    getPage()
  }
  const handleCurrentChange = (val: number) => { // 翻页的回调
    // 组装数据
    page.value = val
    // 发送请求
    getPage()
  }
  
  
  const tmList = ref<TrademarkModel[]>([])
  const getPage = async () => {
    try {
      let result = await trademarkApi.getPage(page.value, limit.value)
      tmList.value = result.records
  
      total.value = result.total
    } catch (error) {
      ElMessage.error('获取品牌分页数据失败,请重试')
      // 注意: return一个失败的promise取决的外部是否调用了这个函数,如果需要把这个函数的错误继续向外传递,此时就需要return失败的promise
      // return Promise.reject(error)
    }
  }
  
  
  // 页面初始化
  onMounted(() => {
    getPage()
  })
  </script>
  
  <style scoped></style>