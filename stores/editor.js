import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', {
  state: () => ({
    htmlCode: '<h1>Hello World</h1>\n<p>Start editing to see the output!</p>',
    liveRun: true
  }),
  actions: {
    setHtmlCode(code) {
      this.htmlCode = code
    },
    setLiveRun(value) {
      this.liveRun = value
    }
  },
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
})
