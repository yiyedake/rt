import { createApp } from 'vue'
import pinia from './stores'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import App from './App.vue' // 根组件
import router from './router' // 路由
import './styles/index.scss' // 全局样式
import ElSvg from './components/SvgIcon/ElSvg' // icon组件
import './permission' // 路由守卫

const app = createApp(App)

//全局注册组件
import CategorySelector from '@/components/CategorySelector/index.vue'
app.component('CategorySelector',CategorySelector)



ElSvg(app)

app.use(pinia)
  .use(router)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .mount('#app')
