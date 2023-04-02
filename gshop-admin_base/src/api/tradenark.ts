import request from '@/utils/request'

// DELETE  删除BaseTrademark   /admin/product/baseTrademark/remove/{id}
// POST    新增BaseTrademark   /admin/product/baseTrademark/save
// PUT     修改BaseTrademark   /admin/product/baseTrademark/update
// GET     分页列表    /admin/product/baseTrademark/{page}/{limit}

export interface TrademarkModel {
    id?:number, //新增数据没有id，编辑或者获取数据得时候才有id
    tmName:string,
    logoUrl:string,
}

export type TrademarkListModel = TrademarkModel[]

export interface TrademarkPageModel {
    records:TrademarkListModel,
    total:number,
    size:number,
    current:number,
    searchCount:boolean,
    pages:number,
}

export default {
    getPage(page:number, limit:number) {
        return request.get<any,TrademarkPageModel>(`/admin/product/baseTrademark/${page}/${limit}`)
    },
    save(data:TrademarkModel) {
        return request.post<any,null>(`/admin/product/baseTrademark/save`,data)
    }
}