import { defineStore } from 'pinia';
import { getToken, removeToken, setToken } from '../utils/token-utils';
// import type { UserInfoState } from './interface';
import {ElMessage} from 'element-plus'
import {staticRoutes} from '@/router/routes'
import userinfoApi, { type UserInfoModel } from '@/api/userinfo';
import type { RouteRecordRaw } from "vue-router";


// interface UserInfoModel {
//   avatar: string,
//   name: string,
//   buttons: string[],
//   roles: string[],
//   routes: string[]
// }

interface UserInfoState {
  token: string;
  userInfo: UserInfoModel
  menuRoutes: RouteRecordRaw[] // 用于生成导航菜单的路由列表
}

// 用来初始化userInfo的
const initUserInfo = () => ({
  avatar: '',
  name: '',
  buttons: [],
  roles: [],
  routes: []
})

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfoStore = defineStore('userInfo', {

	state: (): UserInfoState => ({
    token: getToken() as string,
    userInfo: initUserInfo(),
    menuRoutes: [] // 这个数据将用于侧边菜单栏的渲染
  }),

	actions: {

    async login (username: string, password: string) {
      try {
        let result = await userinfoApi.login({ username, password })
        // console.log(result)
        setToken(result.token)
        this.token = result.token
      } catch (error) {
        ElMessage.error('登陆失败,请重试')
        return Promise.reject(error)
      }
    },
    async getInfo () {
      try {
        let result = await userinfoApi.info()
        // console.log(result)
        // 直接将个人信息存储起来
        this.userInfo = result
        // 获取的个人信息中既有基本信息,还有权限信息,目前先放着
        // 侧边菜单栏的显示是需要权限信息,而权限会放在后面做,这里先写死
        this.menuRoutes = staticRoutes;
      } catch (error) {
        ElMessage.error('获取个人信息失败,请重试')
        return Promise.reject(error)
      }
    },
    async reset() {
      try {
        await userinfoApi.logout()
      } catch (error) {
        console.error(error)
      } finally {
        // 清除locolstorage的数据
        removeToken()
        // 清除store的token
        this.token = ""
        // 重置个人信息
        this.userInfo = initUserInfo()
      }
    }

    // login (username: string, password: string) {
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       if (username==='admin' && password==='111111') {
    //         const token = 'token-atguigu'
    //         setToken(token) // 将token放到localstorage中
    //         this.token = token // 将token放到当前state中
    //         resolve(token)
    //       } else {
    //         reject(new Error('用户名或密码错误!'))
    //         ElMessage.error('用户名或密码错误!')
    //       }
    //     }, 1000)
    //   })
    // },
    // getInfo () {
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       this.name = 'admin'
    //       this.avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
    //       // 获取个人信息的时候需要获取的有: 1. 个人的基本信息 2. 个人的权限信息
    //       // 目前这里给 menuRoutes 写死了,后期我们在做权限相关内容的时候,这里会修改
    //       this.menuRoutes = staticRoutes
    //       resolve({name: this.name, avatar: this.avatar, token: this.token})
    //     }, 1000)
    //   })
    // },

    // reset () {
    //   // 删除local中保存的token
    //   removeToken()
    //   // 提交重置用户信息的mutation
    //   this.token = ''
    //   this.name = ''
    //   this.avatar = ''
    // },
	},
});
