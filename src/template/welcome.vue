<script setup lang="ts">
import { ref, version as vueVersion } from 'vue'
const msg = ref('Hello World!')
</script>

<template>
  vueVersion: {{ vueVersion }}
  <h1>{{ msg }}</h1>
  <n-input v-model:value="msg" />
</template>
