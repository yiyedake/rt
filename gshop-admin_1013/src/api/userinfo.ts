import request from '@/utils/request'

// GET  info   /admin/acl/index/info
// POST login  /admin/acl/index/login
// POST logout /admin/acl/index/logout

interface LoginModel {
  username: string,
  password: string
}

export default {
  login(data: LoginModel) {
    return request.post(`/admin/acl/index/login`, data)
  },
  info() {
    return request.get(`/admin/acl/index/info`)
  }
}