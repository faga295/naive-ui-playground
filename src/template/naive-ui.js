import { getCurrentInstance } from 'vue'
// import naive from 'naive-ui'
// console.log(naive);

let installed = false
await loadStyle()

export function setupNaiveUi() {
  if (installed) return
  const instance = getCurrentInstance()
  console.log(window);
  instance.appContext.app.use(naive)
  installed = true
}

export function loadStyle() {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '#STYLE#'
    link.addEventListener('load', resolve)
    link.addEventListener('error', reject)
    document.body.append(link)
  })
}