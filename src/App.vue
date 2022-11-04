<script setup lang="ts">
import { Repl } from '@vue/repl'
import '@vue/repl/style.css'
import { useStore } from './composables/store'
import Header from './components/Header.vue'

// retrieve some configuration options from the URL
// const query = new URLSearchParams(location.search)

const store = useStore({
  serializedState: location.hash.slice(1)
})
store.init()
</script>

<template>
  <div h-100vh flex flex-col>
    <Header h-14 />
    <Repl
      :store="store"
      :clear-console="false"
      flex-1
      :style="{ '--color-branding': '#18a058' }"
    />
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
</style>
