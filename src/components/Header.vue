<script setup lang="ts">
import { ref } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import { DarkTheme20Regular } from '@vicons/fluent'
import { LogoGithub } from '@vicons/ionicons5'
const isDark = useDark()
const toggleDark = useToggle(isDark)
const naiveVersion = ref()
</script>

<template>
  <div class="nav">
    <div flex justify-between h-full>
      <div flex items-center h-full>
        <img src="/src/assets/logo.svg" alt="logo" h-8 mx-4 />
        <div text-xl>
          Naive UI Playground
        </div>
      </div>

      <div flex items-center gap-2>
        <div>
          <n-select w-40 />
        </div>
        <div cursor-pointer>
          <n-icon size="25" @click="toggleDark()">
            <DarkTheme20Regular />
          </n-icon>
        </div>
        <div>
          <a href="https://github.com/faga295/naive-ui-playground">
            <n-icon size="25" m-0>
              <LogoGithub />
            </n-icon>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.nav {
  box-shadow: 0 0 6px #18a058;
  z-index: 1;
}
.dark {
  background-color: #000;
  color: #fff;
}
</style>
