import { useFetch } from '@vueuse/core'
import type { Ref } from 'vue'
import { compare } from 'compare-versions'

export function getVersions(pkg: string) {
  const url = computed(() => `https://data.jsdelivr.com/v1/package/npm/${pkg}`)
  return useFetch(url, {
    initialData: [],
    afterFetch: (ctx) => ((ctx.data = ctx.data.versions), ctx),
    refetch: true
  }).json().data as Ref<string[]>
}
export function getVueVersions() {
  const versions = getVersions('vue')
  return computed(() =>
    versions.value.filter((version: string) => compare(version, '3.2.0', '>='))
  )
}
export function getNaiveVersions() {
  const versions = getVersions('naive-ui-esm')
  return computed(() =>
    versions.value.filter((version: string) => compare(version, '0.0.2', '>='))
  )
}
