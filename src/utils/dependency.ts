import { useFetch } from '@vueuse/core'
import { compare } from 'compare-versions'

export function getVersion() {
  const url = computed(() => 'https://data.jsdelivr.com/v1/package/npm/vue')
  const versions = useFetch(url, {
    initialData: [],
    afterFetch: (ctx) => ((ctx.data = ctx.data.versions), ctx),
    refetch: true
  }).json().data

  return computed(() =>
    versions.value.filter((version: string) => compare(version, '3.2.0', '>='))
  )
}
