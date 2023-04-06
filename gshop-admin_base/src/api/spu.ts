import request from '@/utils/request'

// DELETE     deleteSpu             /admin/product/deleteSpu/{spuId}
// POST       saveSpuInfo           /admin/product/saveSpuInfo
// POST       更改spu信息           /admin/product/updateSpuInfo
// GET        index                 /admin/product/{page}/{limit}?category3Id={category3Id}
// GET        获取销售属性下拉数据   /admin/product/baseSaleAttrList

export interface SpuImageModel {
  imgName: string,
  imgUrl: string,
}

export interface SpuSaleAttrValueModel {
  baseSaleAttrId: number,
  saleAttrValueName: string
}
export interface SpuSaleAttrModel {
  baseSaleAttrId: number,
  saleAttrName: string,
  spuSaleAttrValueList: SpuSaleAttrValueModel[]
}

export interface SaleAttrModel {
  id: number,
  name: string
}

export interface SpuModel {
  id?: number,
  spuName: string,
  description: string,
  category3Id: number | undefined,
  tmId: number | undefined,
  spuSaleAttrList: SpuSaleAttrModel[],
  spuImageList: SpuImageModel[],
}

export interface SpuPageModel {
  records: SpuModel[],
  total: number,
  size: number,
  current: number,
  searchCount: boolean,
  pages: number,
}

export default {
  getPage(page: number, limit: number, category3Id: number) {
    return request.get<any, SpuPageModel>(`/admin/product/${page}/${limit}?category3Id=${category3Id}`)
  },
  // 获取销售属性下拉
  getBaseSaleAttrList() {
    return request.get<any, SaleAttrModel[]>(`/admin/product/baseSaleAttrList`)
  },
  // 保存api
  saveSpu(data: SpuModel) {
    return request.post<any, null>(`/admin/product/saveSpuInfo`, data)
  }
}