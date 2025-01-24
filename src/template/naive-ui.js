import { getCurrentInstance } from 'vue'
import * as naive from 'naive-ui'

let installed = false
// await loadStyle()

export function setupNaiveUi() {
  if (installed) return
  const instance = getCurrentInstance()
  Object.keys(naive).forEach((name) => {
    instance.appContext.app.component(name, naive[name])
  })
  installed = true
}

// export function loadStyle() {
//   return new Promise((resolve, reject) => {
//     const link = document.createElement('link')
//     link.rel = 'stylesheet'
//     link.href = '#STYLE#'
//     link.addEventListener('load', resolve)
//     link.addEventListener('error', reject)
//     document.body.append(link)
//   })
// }
