<script setup lang="ts">
import { ref, version as vueVersion } from 'vue'
import { NInput } from 'naive-ui'
const msg = ref('Hello World!')
</script>

<template>
  <h1>{{ msg }}</h1>
  <n-input v-model="msg" />


</template>