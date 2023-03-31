import { defineStore } from 'pinia';
import { getToken, removeToken, setToken } from '../utils/token-utils';
import type { UserInfoState } from './interface';
import {ElMessage} from 'element-plus'
import {staticRoutes} from '@/router/routes'
import userinfoApi from '@/api/userinfo';


/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfoStore = defineStore('userInfo', {

	state: (): UserInfoState => ({
    token: getToken() as string,
    name: '',
    avatar: '',
    menuRoutes: [] // 这个数据将用于侧边菜单栏的渲染
  }),

	actions: {

    async login (username: string, password: string) {
      try {
        let result = await userinfoApi.login({ username, password })
        console.log(result)
        setToken(result.token)
        this.token = result.token
      } catch (error) {
        ElMessage.error('登陆失败,请重试')
        return Promise.reject(error)
      }
    },



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

    getInfo () {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.name = 'admin'
          this.avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
          // 获取个人信息的时候需要获取的有: 1. 个人的基本信息 2. 个人的权限信息
          // 目前这里给 menuRoutes 写死了,后期我们在做权限相关内容的时候,这里会修改
          this.menuRoutes = staticRoutes
          resolve({name: this.name, avatar: this.avatar, token: this.token})
        }, 1000)
      })
    },

    reset () {
      // 删除local中保存的token
      removeToken()
      // 提交重置用户信息的mutation
      this.token = ''
      this.name = ''
      this.avatar = ''
    },
	},
});
