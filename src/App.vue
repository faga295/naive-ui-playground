<script setup lang="ts">
import { watchEffect } from 'vue'
import { File, Repl, ReplStore } from '@vue/repl'
import '@vue/repl/style.css'
import mainCode from './template/main.vue?raw'
import welcomeCode from './template/welcome.vue?raw'
import naiveUiCode from './template/naive-ui.js?raw'
import { useStore } from './composables/store'


// retrieve some configuration options from the URL
const query = new URLSearchParams(location.search)

const store = useStore({
  serializedState: location.hash.slice(1)
})
store.init()
console.log(store.state.activeFile.code);

// console.log(query);

// const APP_FILE = 'App.vue'
// const MAIN_FILE = 'PlaygroundMain.vue'
// const NAIVE_UI = 'naive-ui.js'

// const store = new ReplStore({
//   // initialize repl with previously serialized state
//   serializedState: location.hash.slice(1),

//   // starts on the output pane (mobile only) if the URL has a showOutput query
//   showOutput: query.has('showOutput'),
//   // starts on a different tab on the output pane if the URL has a outputMode query
//   // and default to the "preview" tab
//   outputMode: (query.get('outputMode') || 'preview'),
// })

// store.init()
// // persist state to URL hash
// store.setImportMap({
//   imports: {
//     'naive-ui':'https://unpkg.com/naive-ui@2.30.3/dist/index.prod.js'
//   }
// })
// store.setImportMap({
//   imports: {
//     'naive-ui': 'https://unpkg.com/naive-ui@latest/dist/index.prod.js'
//   }
// })
// store.state.files[APP_FILE] = new File(APP_FILE, welcomeCode)
// store.state.files[MAIN_FILE] = new File(MAIN_FILE, mainCode, true)
// store.state.files[NAIVE_UI] = new File(NAIVE_UI, naiveUiCode, true)
// watchEffect(() => history.replaceState({}, '', store.serialize()))
</script>

<template>
  <div h-100vh>
    <Repl 
      :store="store"
      :clear-console="false" 
    h-full/>
  </div>
</template>
<style>
*{
  margin: 0;
  padding: 0
}
</style>
