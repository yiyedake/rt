import request from '@/utils/request'

// DELETE    删除BaseTrademark     /admin/product/baseTrademark/remove/{id}
// POST      新增BaseTrademark     /admin/product/baseTrademark/save
// PUT       修改BaseTrademark     /admin/product/baseTrademark/update
// GET       分页列表              /admin/product/baseTrademark/{page}/{limit}
// GET       获取所有品牌列表       /admin/product/baseTrademark/getTrademarkList

export interface TrademarkModel {
  id?: number, // 新增数据的时候,永远没有id,编辑的或者获取数据的时候,此时一定是有id的
  tmName: string,
  logoUrl: string,
}

export type TrademarkListModel = TrademarkModel[]

export interface TrademarkPageModel {
  records: TrademarkListModel,
  total: number,
  size: number,
  current: number,
  searchCount: boolean,
  pages: number,
}

export default {
  getPage(page: number, limit: number) {
    return request.get<any, TrademarkPageModel>(`/admin/product/baseTrademark/${page}/${limit}`)
  },
  save(data: TrademarkModel) {
    return request.post<any, null>(`/admin/product/baseTrademark/save`, data)
  },
  update(data: TrademarkModel) {
    return request.put<any, null>(`/admin/product/baseTrademark/update`, data)
  },
  delete(id: number) {
    return request.delete<any, null>(`/admin/product/baseTrademark/remove/${id}`)
  },
  getTradermarkList() {
    return request.get<any, TrademarkModel[]>(`/admin/product/baseTrademark/getTrademarkList`)
  }
}