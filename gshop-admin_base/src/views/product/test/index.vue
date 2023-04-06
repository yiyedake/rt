<template>
  <div class="box">
    <h2>关于$event</h2>

    <Child1 @qwer="handler($event, 88)"></Child1>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Child1 from './Child1.vue';

const abc = ref("我爱你")

const handler = (e) => {
  console.log('触发自定义事件', e)
}

// 记住:
// 原生事件中$event是事件对象(浏览器创建的事件对象)
// 
// (自定义事件绑定在标签上没有实际意义,只有绑定在组件上才有意义)
// 自定义事件中$event是我们自己触发的时候传过来的参数
</script>

<style>
.box {
  border: 1px solid #333;
  margin: 10px;
}
</style>