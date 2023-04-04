import request from '@/utils/request'

// GET     attrInfoList    /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
// DELETE  deleteAttr      /admin/product/deleteAttr/{attrId}
// POST    saveAttrInfo    /admin/product/saveAttrInfo


export interface AttrValueModel {
  id?: number,
  valueName: string,
  attrId?: number,
  // -----------------------
  inputVisible?: boolean // 这个值是我们手动添加的,后端不要,前端控制input显示使用
}


export interface AttrValueModel {
  id?: number,
  valueName: string,
  attrId?: number
}

export interface AttrModel {
  id?: number,
  attrName: string,
  categoryId: number | undefined,
  categoryLevel: number,
  attrValueList: AttrValueModel[],
}

export default {
  getList(category1Id: number, category2Id: number, category3Id: number) {
    return request.get<any, AttrModel[]>(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
  },
  saveAttrInfo(data: AttrModel) {
    return request.post<any, null>(`/admin/product/saveAttrInfo`, data)
  }
}