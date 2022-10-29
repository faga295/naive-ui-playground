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
export type VersionKey = 'vue' | 'elementPlus'
export type Versions = Record<VersionKey, string>
export interface UserOptions {
  styleSource?: string
  showHidden?: boolean
}
export type SerializeState = Record<string, string> & {
  _o?: UserOptions
}

const MAIN_FILE = 'PlaygroundMain.vue'
const APP_FILE = 'App.vue'
const NAIVEUI_FILE = 'naive-ui.js'
const IMPORT_MAP = 'import-map.json'
export const USER_IMPORT_MAP = 'import_map.json'

export const useStore = (initial: Initial) => {
  const versions = reactive(
    initial.versions || { vue: 'latest', elementPlus: 'latest' }
  )

  let compiler = shallowRef<typeof import('vue/compiler-sfc')>()
  // const [nightly, toggleNightly] = $(useToggle(false))
  let userOptions = ref<UserOptions>(initial.userOptions || {})
  // const hideFile = computed(() => !IS_DEV && !userOptions.showHidden)
  const importMap = {
    imports: {
      'naive-ui': 'https://cdn.jsdelivr.net/npm/naive-ui@2.33.5/dist/index.min.mjs',
      'vue': 'https://unpkg.com/@vue/runtime-dom@3.2.41/dist/runtime-dom.esm-browser.js'
    }
  }
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

  // const bultinImportMap = computed<ImportMap>(() =>
  //   genImportMap(versions, nightly)
  // )
  // const userImportMap = $computed<ImportMap>(() => {
  //   const code = state.files[USER_IMPORT_MAP]?.code.trim()
  //   if (!code) return {}
  //   let map: ImportMap = {}
  //   try {
  //     map = JSON.parse(code)
  //   } catch (err) {
  //     console.error(err)
  //   }
  //   return map
  // })
  // const importMap = $computed<ImportMap>(() =>
  //   mergeImportMap(bultinImportMap, userImportMap)
  // )


  // eslint-disable-next-line no-console
  // console.log('Files:', files, 'Options:', userOptions)

  const store: Store = reactive({
    init,
    state,
    compiler: compiler.value!,
    setActive,
    addFile,
    deleteFile,
    getImportMap,
    initialShowOutput: false,
    initialOutputMode: 'preview',
  })

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
//   watch(
//     () => versions.elementPlus,
//     (version) => {
//       const file = new File(
//         ELEMENT_PLUS_FILE,
//         generateElementPlusCode(version, userOptions.styleSource).trim(),
//         hideFile
//       )
//       state.files[ELEMENT_PLUS_FILE] = file
//       compileFile(store, file)
//     },
//     { immediate: true }
//   )

  // function generateElementPlusCode(version: string, styleSource?: string) {
  //   const style = styleSource
  //     ? styleSource.replace('#VERSION#', version)
  //     : genCdnLink(
  //         nightly ? '@element-plus/nightly' : 'element-plus',
  //         version,
  //         '/dist/index.css'
  //       )
  //   return elementPlusCode.replace('#STYLE#', style)
  // }

  // async function setVueVersion(version: string) {
  //   const { compilerSfc, runtimeDom } = genVueLink(version)

  //   compiler = await import(/* @vite-ignore */ compilerSfc)
  //   state.vueRuntimeURL = runtimeDom
  //   versions.vue = version

  //   // eslint-disable-next-line no-console
  //   console.info(`[@vue/repl] Now using Vue version: ${version}`)
  // }

  async function init() {
    // await setVueVersion(versions.vue)
    compiler.value = await import('https://unpkg.com/@vue/compiler-sfc@3.2.41/dist/compiler-sfc.esm-browser.js')
    store.compiler = compiler.value
    for (const file of Object.values(state.files)) {
      compileFile(store, file)
    }
    console.log(files);
    
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
    // state._o = userOptions
    return '#'+utoa(JSON.stringify(state))
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
        if (filename === '_o') continue
        files[filename] = new File(filename, file as string)
      }
      // userOptions = saved._o || {}
    } else {
      files[APP_FILE] = new File(APP_FILE, welcomeCode)
    }
    files[MAIN_FILE] = new File(MAIN_FILE, mainCode, true)
    files[IMPORT_MAP] = new File(IMPORT_MAP, JSON.stringify(importMap))
    if (!files[USER_IMPORT_MAP]) {
      files[USER_IMPORT_MAP] = new File(
        USER_IMPORT_MAP,
        JSON.stringify({ imports: {} }, undefined, 2)
      )
    }
    files[NAIVEUI_FILE] = new File(NAIVEUI_FILE, naiveUiCode, true)
    return files
  }

  function setActive(filename: string) {
    const file = state.files[filename]
    if (file.hidden) return
    state.activeFile = state.files[filename]
  }

  function addFile(fileOrFilename: string | File) {
    const file =
      typeof fileOrFilename === 'string'
        ? new File(fileOrFilename)
        : fileOrFilename
    state.files[file.filename] = file
    setActive(file.filename)
  }
  function deleteFile(filename: string) {
    delete state.files[filename]
  }


  function getImportMap() {
    return importMap
  }

  // async function setVersion(key: VersionKey, version: string) {
  //   switch (key) {
  //     case 'elementPlus':
  //       setElementPlusVersion(version)
  //       break
  //     case 'vue':
  //       await setVueVersion(version)
  //       break
  //   }
  // }

  function setElementPlusVersion(version: string) {
    versions.elementPlus = version
  }

  return {
    ...store,

    versions,

    init,
    serialize,
    // setVersion,
    // toggleNightly,
    pr: initial.pr,
  }
}

export type ReplStore = ReturnType<typeof useStore>