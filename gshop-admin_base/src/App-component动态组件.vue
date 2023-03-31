<template>
  <div id="app">
    <component :is="News"></component>
  </div>
</template>

<script setup lang="ts">
import Messsage from '@/components/Message/index.vue'
import News from '@/components/News/index.vue'

</script>
