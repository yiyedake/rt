import request from '@/utils/request'

// GET getCategory1 /admin/product/getCategory1
// GET getCategory2 /admin/product/getCategory2/{category1Id}
// GET getCategory3 /admin/product/getCategory3/{category2Id}

export interface CategoryModel {
  id: number,
  name: string,
  category1Id?: number,
  category2Id?: number
}

export default {
  getCategory1List() {
    return request.get<any, CategoryModel[]>(`/admin/product/getCategory1`)
  },
  getCategory2List(category1Id: number) {
    return request.get<any, CategoryModel[]>(`/admin/product/getCategory2/${category1Id}`)
  },
  getCategory3List(category2Id: number) {
    return request.get<any, CategoryModel[]>(`/admin/product/getCategory3/${category2Id}`)
  },
}