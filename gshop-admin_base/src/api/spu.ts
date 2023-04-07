import request from '@/utils/request'

// DELETE     deleteSpu             /admin/product/deleteSpu/{spuId}
// POST       saveSpuInfo           /admin/product/saveSpuInfo
// POST       更改spu信息           /admin/product/updateSpuInfo
// GET        index                 /admin/product/{page}/{limit}?category3Id={category3Id}
// GET        获取销售属性下拉数据   /admin/product/baseSaleAttrList
// ------------------------------------------------------------------------
// get        根据spu的id获取图片列表数据   /admin/product/spuImageList/{ spuId }
// get        根据spu的id获取销售属性数据   /admin/product/spuSaleAttrList/{ spuId }

export interface SpuImageModel {
  imgName: string,
  imgUrl: string,
  id?: number, // 后加的
  spuId?: number, // 后加的
  // --------------
  name?: string, // 前端会用到这三个数据
  response?: any,
  url?: string
}

export interface SpuSaleAttrValueModel {
  id?: number, // 后加的
  isChecked?: null, // 后加的
  saleAttrName?: string, // 后加的
  spuId?: number, // 后加的
  baseSaleAttrId: number,
  saleAttrValueName: string
}
export interface SpuSaleAttrModel {
  id?: number, // 后加的
  spuId?: number, // 后加的
  baseSaleAttrId: number,
  saleAttrName: string,
  spuSaleAttrValueList: SpuSaleAttrValueModel[],
  // ------------------------------
  inputVisible?: boolean // 控制按钮和input框切换显示
  inputValue?: string // 用来收集当前输入的销售属性值,绑定在销售属性上
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
  },
  // 根据spuId获取图片列表
  getSpuImageListBySpuId(spuId: number) {
    return request.get<any, SpuImageModel[]>(`/admin/product/spuImageList/${ spuId }`)
  },
  // 根据spuId获取销售属性
  getSaleAttrListBySpuId(spuId: number) {
    return request.get<any, SpuSaleAttrModel[]>(`/admin/product/spuSaleAttrList/${ spuId }`)
  },
  // 更新spu
  updateSpu(spu: SpuModel) {
    return request.post<any, null>(`/admin/product/updateSpuInfo`, spu)
  },
  // 删除spu
  deleteSpu(spuId: number) {
    return request.delete<any, null>(`/admin/product/deleteSpu/${spuId}`)
  }
}