import request from '@/utils/request'

// GET  info   /admin/acl/index/info
// POST login  /admin/acl/index/login
// POST logout /admin/acl/index/logout

export interface LoginModel {
  username: string,
  password: string
}

export interface TokenModel {
  token: string
}

export interface UserInfoModel {
  avatar: string,
  name: string,
  buttons: string[],
  roles: string[],
  routes: string[]
}

// interface ResultModel<T> {
//   code: number,
//   data: T,
//   messsage: string
// }


export default {
  login(data: LoginModel) {
    return request.post<any, TokenModel>(`/admin/acl/index/login`, data)
  },
  info() {
    return request.get<any, UserInfoModel>(`/admin/acl/index/info`)
  },
  logout() {
    return request.post<any, null>(`/admin/acl/index/logout`)
  }
}


// 泛型函数
// function fn1 () {}
// function fn2 (n: number) {}
// function fn3 (n: number): number {
//   return n
// }
// function fn4<T>(n: T): T {
//   return n
// }
// 泛型接口
// interface ResultModel<T> {
//   code: number,
//   data: T,
//   message: string
// }
// 什么泛型?
// 定义的时候定义泛型,使用的时候确定泛型,泛型不是一个具体的类型