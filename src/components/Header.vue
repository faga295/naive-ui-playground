<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import type { ComputedRef } from 'vue'
import { DarkTheme20Regular } from '@vicons/fluent'
import { LogoGithub } from '@vicons/ionicons5'
import type { ReplStore, VersionKey } from '../composables/store'
import { getNaiveVersions, getVueVersions } from '../utils/dependency'

const { store } = defineProps<{
  store: ReplStore
}>()

const isDark = useDark()
const toggleDark = useToggle(isDark)
const vueVersions = getVueVersions()
const naiveUIVersions = getNaiveVersions()
const getOptions = (key: VersionKey) => {
  let versions: ComputedRef<string[]>
  switch (key) {
    case 'vue':
      versions = vueVersions
      break
    case 'naiveUI':
      versions = naiveUIVersions
      break
  }

  return computed(() =>
    versions.value.map((item: string) => ({
      label: item,
      value: item
    }))
  )
}
const versions = reactive({
  vue: {
    active: store.versions.vue,
    options: getOptions('vue')
  },
  naiveUI: {
    active: store.versions.naiveUI,
    options: getOptions('naiveUI')
  }
})
</script>

<template>
  <div class="nav">
    <div flex justify-between h-full>
      <div flex items-center h-full>
        <img src="/src/assets/logo.svg" alt="logo" h-8 mx-4 />
        <div text-xl>Naive UI Playground</div>
      </div>

      <div flex items-center gap-2>
        <div v-for="(v, key) of versions" :key="key" flex items-center>
          <span mr-2>{{ key }} Version:</span>
          <n-select
            w-40
            :value="v.active"
            :options="v.options"
            @update:value="(version: string) => store.setVersion(key, version)"
          />
        </div>
        <div cursor-pointer>
          <n-icon size="25" @click="toggleDark()">
            <DarkTheme20Regular />
          </n-icon>
        </div>
        <div>
          <a href="https://github.com/tusen-ai/naive-ui">
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
