import { defineStore } from 'pinia'
import categoryApi, { type CategoryModel } from '@/api/category'
import { ElMessage } from 'element-plus'

// let a: '我爱你' = '我爱你'

interface CategoryStoreModel {
    category1Id: undefined | number,
    category2Id: undefined | number,
    category3Id: undefined | number,
    category1List: CategoryModel[]
    category2List: CategoryModel[],
    category3List: CategoryModel[],
}

const useCategoryStore = defineStore('category', {
  state: (): CategoryStoreModel => ({
    category1Id: undefined,
    category2Id: undefined,
    category3Id: undefined,
    category1List: [],
    category2List: [],
    category3List: []
  }),
  actions: {
    async getCategory1List() {
      try {
        let result = await categoryApi.getCategory1List()
        this.category1List = result
      } catch (error) {
        ElMessage.error('获取一级分类数据失败,请重试')
      }
    },
    async getCategory2List () {
      // 清除数据
      this.category2Id = undefined
      this.category3Id = undefined
      this.category2List = []
      this.category3List = []
      // 发送请求
      try {
        let result = await categoryApi.getCategory2List(this.category1Id as number)
        this.category2List = result
      } catch (error) {
        ElMessage.error('获取二级分类数据失败,请重试')
      }
    },
    async getCategory3List () {
      // 清除数据
      this.category3Id = undefined
      this.category3List = []
      // 发送请求
      try {
        let result = await categoryApi.getCategory3List(this.category2Id as number)
        this.category3List = result
      } catch (error) {
        ElMessage.error('获取三级分类数据失败,请重试')
      }
    },
  },
  getters: {}
})

export default useCategoryStore