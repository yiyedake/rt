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
                    <img :src="row.logoUrl" style="width:80px; height:80px;">
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="{ row, $index }">
                    <el-button type="warning" size="small" :icon="Edit">编辑</el-button>
                    <el-button type="danger" size="small" :icon="Edit">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <el-pagination v-model:current-page="page" v-model:page-size="limit" :total="total" :page-sizes="[3, 5, 7, 10]"
            layout="prev, pager, next, jumper, -> , sizes, total, " @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />

            <!-- //弹框 -->
            <el-dialog
            v-model="dialogVisible"
            title="添加品牌"
            width="50%"
          >
        <!-- input输入框 -->
        <el-form style="width:75%" label-width="100px">
            <el-form-item label="品牌名称">
                <el-input v-model="tmForm.tmName" placeholder="请输入品牌名称"></el-input>
            </el-form-item>
            <el-form-item label="品牌LOGO">
                
                <el-upload
                    class="avatar-uploader"
                    :action="action"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                >
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>

                    <template #tip>
                        <div class="el-upload__tip">
                          你个老6又来上传图片
                        </div>
                      </template>
                </el-upload>

            </el-form-item>
        </el-form>
    
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="onSave">
                  保存
                </el-button>
              </span>
            </template>
          </el-dialog>




    </el-card>
</template>

<script setup lang="ts">
// 写页面的步骤
//1.静态搭建
// 路由组件  -定义（创建一个.vue文件）,注册（路由注册），使用（router-link跳转，router-view渲染）
// 非路由组件 -定义（创建一个.vue文件），注册（全局注册），使用（引入直接使用）
//   -------------
//  这里已经配置过路由了，直接搭建静态就行（数据内容先放一放）
// el-table
// 之前的表格标签table写的是tr是行，而我们组件写的列
// 每一列需要定义一个表头，通过el-table-column 的 label属性定义
// type="index"显示序号 ---  type="selection"显示复选框
//prop="tmName"设置当前列的品牌名称
//当列需要自定义内容得时候需要使用插槽，row是当前行的数据，￥index拿到的是当前行得下标

// 2.初始化数据展示（渲染数据）
// 2.1准备api函数（同时需要写上类型）
// 2.2页面初始化的时候调用api,拿到数据
// 3.实现交互

//3.实现交互
//3.1翻页  --直接写
//3.2新增
    //3.2.1点击新增 弹框
    //3.3.2静态搭建弹框中得内容
    //3.3.3api准备 同时写TS类型  是为了知道我们收集表单数据得时候收集哪些东西
    //3.3.4收集表单数据


//3.3编辑
//3.4删除
import { Delete, Edit, Plus } from '@element-plus/icons-vue';
import { ref, onMounted } from 'vue'
import trademarkApi, { type TrademarkListModel, type TrademarkModel } from '@/api/tradenark'
import { ElMessage, type UploadProps } from 'element-plus'

const action = `${ import.meta.env.VITE_API_URL}/admin/product/upload`

//新增
const dialogVisible = ref(false)
const addTrademark = () => {
    dialogVisible.value = true
}

const initTmForm = () => ({
    tmName:'',
    logoUrl:''
})

const tmForm = ref<TrademarkModel>(initTmForm()) //用来收集数据
const onSave = () => {

}


//上传图片
//上传成功得回调 -目的：为了拿到上传成功之后接口返回大数据
const imageUrl = ref('')
const handleAvatarSuccess: UploadProps['onSuccess'] = (response,uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}
//上传之前的回调 -目的：上传之前对文件·选择得校验
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

//分页
const page = ref(1)
const limit = ref(3)
const total = ref(0)//总天数不能写不然报警告
const handleSizeChange = (val: number) => {//每页条数改变的回调
    //组装数据
    limit.value = val
    //发送请求
    getPage()
}
const handleCurrentChange = (val: number) => {//翻页的回调
    //组装数据
    page.value = val
    //发送请求
    getPage()
}

const tmList = ref<TrademarkModel[]>([])
const getPage = async () => {
    try {
        let result = await trademarkApi.getPage(page.value, limit.value)
        tmList.value = result.records

        total.value = result.total
    } catch (error) {
        ElMessage.error('获取品牌分页数据失败，请重试')
        //return Promise.reject(error)---注意：return一个失败的promise取决的外部是否调用了这个函数，如果需要把这个函数的错误继续向外传递，此时就需要return失败的promise
    }
}


//页面初始化
onMounted(() => {
    getPage()
})
</script>

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