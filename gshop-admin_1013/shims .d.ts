declare module "*.vue" {
  // defineComponent 作用是用来定义一个组件的
  import { defineComponent } from "vue";
  // const Component 声明一个常量
  // ReturnType 用来获取返回值的类型
  // typeof defineComponent 检测定义组件的类型的
  // ReturnType<typeof defineComponent> 获取到当前组件的类型
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}