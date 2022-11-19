import { File, type Store, type StoreState, compileFile } from '@vue/repl'
import { atou, utoa } from '../utils/encode'

import mainCode from '../template/main.vue?raw'
import welcomeCode from '../template/welcome.vue?raw'
import naiveUiCode from '../template/naive-ui.js?raw'

export interface Initial {
  serializedState?: string
  versions?: Versions
  userOptions?: UserOptions
  pr?: string | null
}
export type VersionKey = 'vue' | 'naiveUI'
export type Versions = Record<VersionKey, string>
export interface UserOptions {
  styleSource?: string
  showHidden?: boolean
}
export type SerializeState = Record<string, string> & {
  _o?: UserOptions
}

export interface ImportMap {
  imports: Record<string, string>
}
const MAIN_FILE = 'PlaygroundMain.vue'
const APP_FILE = 'App.vue'
const NAIVEUI_FILE = 'naive-ui.js'
const IMPORT_MAP = 'import-map.json'
export const USER_IMPORT_MAP = 'import_map.json'

export const useStore = (initial: Initial) => {
  const versions = reactive(
    initial.versions || { vue: 'latest', naiveUI: 'latest' }
  )

  const compiler = shallowRef<typeof import('vue/compiler-sfc')>()
  // const [nightly, toggleNightly] = $(useToggle(false))
  // let userOptions = ref<UserOptions>(initial.userOptions || {})
  // const hideFile = computed(() => !IS_DEV && !userOptions.showHidden)

  const files = initFiles(initial.serializedState || '')
  const state = reactive<StoreState>({
    mainFile: MAIN_FILE,
    files,
    activeFile: files[APP_FILE],
    errors: [],
    vueRuntimeURL: '',
    vueServerRendererURL: '',
    resetFlip: true
  })

  const store: Store = reactive({
    init,
    state,
    compiler: compiler.value!,
    setActive,
    addFile,
    deleteFile,
    getImportMap,
    setImportMap,
    initialShowOutput: false,
    initialOutputMode: 'preview',
  })
  const userImportMap = computed<ImportMap>(() => {
    const code = state.files[USER_IMPORT_MAP].code.trim()

    if (!code) return {}
    try {
      return JSON.parse(code)
    } catch (err) {
      console.error(err)
    }
  })
  const buildInImportMap = reactive({
    imports: {
      'naive-ui': 'https://cdn.jsdelivr.net/npm/naive-ui-esm@0.0.2/dist/index.mjs',
      'vue': 'https://unpkg.com/@vue/runtime-dom@3.2.41/dist/runtime-dom.esm-browser.js'
    }
  })
  const importMap = computed<ImportMap>(() => (
    {
      imports: {
        ...buildInImportMap.imports,
        ...userImportMap.value?.imports
      }
    }
  ))
  watch(
    importMap,
    (content) => {
      state.files[IMPORT_MAP] = new File(
        IMPORT_MAP,
        JSON.stringify(content, undefined, 2),
      )
    },
    { immediate: true, deep: true }
  )

  async function init() {
    await setVueVersion(versions.vue)
    for (const file of Object.values(state.files)) {
      compileFile(store, file)
    }

    watchEffect(() => compileFile(store, state.activeFile))
  }

  function getFiles() {
    const exported: Record<string, string> = {}
    for (const file of Object.values(state.files)) {
      if (file.hidden) continue
      exported[file.filename] = file.code
    }
    return exported
  }

  function serialize() {
    const state: SerializeState = { ...getFiles() }
    return `#${utoa(JSON.stringify(state))}`
  }
  function deserialize(text: string): SerializeState {
    const state = JSON.parse(atou(text))
    return state
  }

  function initFiles(serializedState: string) {
    const files: StoreState['files'] = {}

    if (serializedState) {
      const saved = deserialize(serializedState)
      for (const [filename, file] of Object.entries(saved)) {
        if (filename === '_o')
          continue
        files[filename] = new File(filename, file as string)
      }
    } else {
      files[APP_FILE] = new File(APP_FILE, welcomeCode)
    }
    files[NAIVEUI_FILE] = new File(NAIVEUI_FILE, naiveUiCode, true)
    files[MAIN_FILE] = new File(MAIN_FILE, mainCode, true)
    if (!files[USER_IMPORT_MAP]) {
      files[USER_IMPORT_MAP] = new File(USER_IMPORT_MAP, JSON.stringify({ imports: {} }, undefined, 2))
    }
    return files
  }

  function setActive(filename: string) {
    const file = state.files[filename]
    if (file.hidden) return
    state.activeFile = state.files[filename]
  }

  function addFile(fileOrFilename: string | File) {
    const file
      = typeof fileOrFilename === 'string'
        ? new File(fileOrFilename)
        : fileOrFilename
    state.files[file.filename] = file
    setActive(file.filename)
  }
  function deleteFile(filename: string) {
    delete state.files[filename]
  }

  function getImportMap() {
    return importMap.value
  }

  function setImportMap() {
    state.files['import-map.json']!.code = JSON.stringify(importMap, null, 2)
  }

  async function setVersion(key: VersionKey, version: string) {
    switch (key) {
      case 'vue':
        await setVueVersion(version)
        break
      case 'naiveUI':
        await setNaiveVersion(version)
        break
    }
  }

  async function setVueVersion(version: string) {
    compiler.value = await import(`https://unpkg.com/@vue/compiler-sfc@${version}/dist/compiler-sfc.esm-browser.js`)
    // @ts-expect-error compiler is unknown
    store.compiler = compiler.value
    versions.vue = version
    importMap.value.imports.vue = `https://unpkg.com/@vue/runtime-dom@${version}/dist/runtime-dom.esm-browser.js`
  }
  async function setNaiveVersion(version: string) {
    versions.naiveUI = version
    importMap.value.imports['naive-ui'] = `https://cdn.jsdelivr.net/npm/naive-ui-esm@${version}/dist/index.mjs`
  }

  return {
    ...store,

    versions,

    init,
    serialize,
    setVersion,
  }
}

export type ReplStore = ReturnType<typeof useStore>
