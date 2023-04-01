import request from '@/utils/request'

export interface TrademarkModel {
    id:number,
    tmName:string,
    logoUrl:string,
}

export type TrademarkListModel = TrademarkModel[]

export interface TrademarkPageModel{
    records: TrademarkListModel,
    total:number,
    current:number,
    searchCount:boolean,
    pages:number,
}

export default{
    getPage(page: number, limit: number) {
        return request.get<any, TrademarkPageModel>(`/admin/product/baseTrademark/${page}/${limit}`)
      }
}
