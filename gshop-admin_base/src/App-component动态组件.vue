<template>
  <div id="app">
    <!--
      component动态组件渲染
      需要一个is属性,is决定了动态组件component的渲染
      is两种写法
      1. 直接写组件就行(组件)
      2. 写已注册的组件名(string)
    -->
    <component :is="News"></component>
  </div>
</template>

<script setup lang="ts">
import Messsage from '@/components/Message/index.vue'
import News from '@/components/News/index.vue'

</script>
