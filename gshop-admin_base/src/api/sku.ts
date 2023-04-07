import request from '@/utils/request'
import type { SpuImageModel } from '@/api/spu'

export interface SkusaleAttrValueModel{
    saleAttrId:string
    saleAttrValueId:string
}

export interface SkuAttrValueModel{
    attrId:string
    valueId:string
}

export interface SkuModel{
    id?: number, // 新增没有,编辑的时候有
    spuId: number | undefined,
    tmId: number | undefined,
    category3Id: number | undefined,
    price: string,
    skuName: string,
    skuDesc: string,
    weight: string,
    skuDefaultImg: string,
    createTime: string,
    skuImageList: SpuImageModel[],
    skuAttrValueList: SkuAttrValueModel[],
    skuSaleAttrValueList: SkuSaleAttrValueModel[],
}

export default {
    save(sku:SkuModel){
        return request.post<any,null>(`/admin/product/saveSkuInfo`, sku)
    },
    findBySpuId(spuId: number) {
        return request.get<any, SkuModel[]>(`/admin/product/findBySpuId/${ spuId }`)
      }
}