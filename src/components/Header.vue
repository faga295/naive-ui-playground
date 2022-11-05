<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { DarkTheme20Regular } from '@vicons/fluent'
import { LogoGithub } from '@vicons/ionicons5'
import type { ReplStore } from '../composables/store'
import { getVersion } from '../utils/dependency'

const { store } = defineProps<{
  store: ReplStore
}>()

const isDark = useDark()
const toggleDark = useToggle(isDark)
const versions = getVersion()
const options = computed(() =>
  versions.value.map((item: string) => ({
    label: item,
    value: item
  }))
)
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
        <div flex items-center>
          <span mr-2>Vue Version:</span>
          <n-select
            w-40
            :value="store.versions.vue"
            :options="options"
            @update:value="(version: string) => store.setVersion('vue', version)"
          />
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

<style lang="scss">
.nav {
  box-shadow: 0 0 6px #18a058;
  z-index: 1;
  background-color: var(--bg);
  color: var(--text-color);
  a {
    color: var(--text-color);
  }
}
.dark {
  .nav {
    --bg: #1a1a1a;
    --text-color: #fff;
  }
}
</style>
