<script setup lang="ts">
import { ref, version as vueVersion } from 'vue'
const msg = ref('Hello World!')
</script>

<template>
  <h1>{{ msg }}</h1>
  <n-input v-model="msg" />


</template>