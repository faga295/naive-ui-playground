<script setup lang="ts">
import { Repl } from '@vue/repl'
import '@vue/repl/style.css'
import { useStore } from './composables/store'
import Header from './components/Header.vue'

// retrieve some configuration options from the URL
// const query = new URLSearchParams(location.search)
const show = ref(true)
const store = useStore({
  serializedState: location.hash.slice(1)
})
watchEffect(() => history.replaceState({}, '', store.serialize()))
onMounted(async () => {
  await store.init()
  show.value = false
})
</script>

<template>
  <div h-100vh>
    <n-spin :show="show" h-full>
      <Header v-if="!show" :store="store" h-14 />
      <Repl v-if="!show" :store="store" :clear-console="false" flex-1 :style="{ '--color-branding': '#18a058' }" />
    </n-spin>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
  color: #000;
}

.n-spin-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
