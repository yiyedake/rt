<template>
  <el-card class="box-card">

    <template #header>

      <el-button type="primary" :icon="Plus" @click="addTrademark">添加</el-button>

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
          <el-button type="warning" :icon="Edit" @click="editTrademark(row)">编辑</el-button>
          <el-button type="danger" :icon="Delete" @click="deleteTrademark(row)">删除</el-button>
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
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      width="50%"
      @close="cancelSave"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      
      <el-form :model="tmForm" :rules="rules" ref="ruleFormRef" style="width: 80%" label-width="100px">
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="tmForm.tmName" placeholder="请输入品牌名称"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">

          <el-upload
            class="avatar-uploader"
            :action="action"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >

            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>

            <template #tip>
              <div class="el-upload__tip">
                上传图片必须是jpg且不能大于2M
              </div>
            </template>
          </el-upload>

        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelSave(ruleFormRef)">取消</el-button>
          <el-button type="primary" @click="onSave(ruleFormRef)">保存</el-button>
        </span>
      </template>
    </el-dialog>


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
//        3.2.1 点击"新增"按钮,让dialog弹出弹框
//        3.2.2 静态搭建弹框中的内容
//              el-form 是form表单
//                  lable-width="100px" 控制lable的宽度
//              el-form-item
//                  label="品牌名称" 控制左边的文本
//                  标签之间写的内容,是右侧内容
//         3.3.3 api准备(同时写TS类型) - 目的: 是为了知道我们收集表单数据的时候收集哪些东西 (完事)
//         3.3.4 收集表单数据
//                3.3.4.1 input数据直接v-model绑定收集
//                3.3.4.2 上传组件数据收集 - 单独收集
//                 
//                点击"保存"按钮的时候调用api,传给后端要收集的数据即可
//    3.3 编辑
//        3.3.1 点击"编辑"按钮,要弹出弹框
//              同时需要在弹框中的form表单回显数据(注意:需要深拷贝)
//              api准备
//              点击保存的时候调用api(这里需要判断是新增还是编辑,通过id判断)
//    3.4 删除
//        所有的删除都需要做双重校验(Double check),只要修改数据库数据(调接口)都要去双重校验
//        弹出弹框,当点击确认的时候才要删除该数据,点击取消不处理
//        准备api
//        点击确认的时候,调用api删除即可(需要传id)
//    3.5 bug:
//        不管在保存还是取消的时候都需要重置表单
//    3.6 表单校验
//        表单校验是交给form表单去做的,需要配置如下条件:
//        1. el-form 需要配置 :model 属性,把数据交给el-form让组件去校验
//        2. el-form 需要配置 :rules 属性,告诉表单组件我们的校验规则是什么
//                                        规则中定义每个字段的单独的规则,但是不知道是哪个form-item的规则
//        3. el-form-item 配置配置 prop 属性, 告诉组件当前form-item校验的字段规则是哪个
//        注意: 在保存之前需要校验一下表单,校验通过才能调用接口
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { ref, onMounted, reactive } from 'vue'
import trademarkApi, { type TrademarkListModel, type TrademarkModel } from '@/api/trademark'
import { ElMessageBox, ElMessage, type UploadProps, type FormRules, type FormInstance  } from 'element-plus';
import { cloneDeep } from 'lodash'
// import type { UploadProps } from 'element-plus'
const action = `${ import.meta.env.VITE_API_URL }/admin/product/upload`

//自定义规则校验得函数
const validateTmName = (rule: any, value: any, callback: any) => {
// console.log(rule)//拿到的是校验字段
// console.log(value)//拿到的是输入的值
// console.log(callback)//回调函数，不传参数直接调用，校验规则通过，如果传递的是错误对象则不通过



  if (value === '') {
    callback(new Error('请输入品牌名称'))
  } else if (!(value.lenght >= 2 && value.lenght <= 10)) {
    callback(new Error('品牌名称长度为2到10个字'))
  }else{
    callback()
  }
}


// 表单校验
const rules = reactive<FormRules>({
  // 属性名是要校验的字段,属性值是配置的规则数组,数组中放规则对象

  // tmName: [
  //   // required 必填    message 提示信息     触发方式: 支持 blur change
  //   { required: true, message: '品牌名必填', trigger: 'blur' },
  //   // 最短2字 最长10字       
  //   { min: 2, max: 10, message: '品牌名长度为2到10个字符', trigger: 'blur' },
  // ],
  tmName:[
    //validator配置自定义规则得函数  trigger触发方式
    { validator: validateTmName, trigger: 'blur' }
  ],
  logoUrl: [
    { required: true, message: '图片LOGO必填', trigger: 'change' },
  ]
})





// 编辑回显数据
const editTrademark = (row: TrademarkModel) => {
  dialogVisible.value = true
  // tmForm.value = JSON.parse(JSON.stringify(row))
  tmForm.value = cloneDeep(row)
}
// 删除
const deleteTrademark = (row: TrademarkModel) => {
  ElMessageBox.confirm(
    `确认要删除[${ row.tmName }]吗?`,
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: ' 取消',
      type: 'warning',
    }
  )
  .then(async () => {
    // 发请求调接口
    try {
      await trademarkApi.delete(row.id as number)
      ElMessage.success('删除成功')
      getPage()
    } catch (error) {
      ElMessage.error('删除失败,请重试')
    }
  })
}








// 新增
const dialogVisible = ref(false)
const addTrademark = () => {
  dialogVisible.value = true
}

const initTmForm = () => ({
  tmName: '',
  logoUrl: ''
})
const tmForm = ref<TrademarkModel>(initTmForm()) // 这个用来收集数据

// 保存
const ruleFormRef = ref<FormInstance>() // 为什么需要这个组件实例,因为我们就是让组件去给我们进行表单校验呢,所以需要获取到实例进行传参
const onSave = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => { // 校验通过 valid 为true,不通过为false
    if (valid) {
      try {
        if (tmForm.value.id) { // 只要有id就是编辑
          await trademarkApi.update(tmForm.value)
        } else { // 没有id是新增
          await trademarkApi.save(tmForm.value)
        }
        dialogVisible.value = false // 弹框消失
        tmForm.value = initTmForm() // 重置form表单数据
        getPage() // 重新获取当前页面数据
      } catch (error) {
        ElMessage.error("保存失败,请重试")
      }
    }
  })
}
// 取消
const cancelSave = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields() // 重置表单校验
  dialogVisible.value = false
  tmForm.value = initTmForm() // 重置表单数据
}




// 上传图片
// 上传成功的回调 - 目的:为了拿到上传成功之后接口返回的数据(图片的url)
const imageUrl = ref('')
// response 接口返回的数据 uploadFile 图片的详细信息,里面有图片的name和size和response
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  tmForm.value.logoUrl = response.data as string
  ruleFormRef.value?.validateField('logoUrl')
}
// 上传之前的回调 - 目的:上传之前对文件选择的校验
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('图片必须是JPG格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片不能大于2MB!')
    return false
  }
  return true
}
// 常识:
// 1byte(字节) = 8bit(位)
// 1Kb = 1024byte
// 1M = 1024KB
// bit(位)是计算机最小存储单元(存的二进制0和1)
// byte(字节)是计算机的基本存储单位






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

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>