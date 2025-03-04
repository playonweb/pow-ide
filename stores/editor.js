import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', {
  state: () => ({
    htmlCode: '<h1>Hello World</h1>\n<p>Start editing to see the output!</p>',
  }),
  actions: {
    setHtmlCode(code) {
      this.htmlCode = code
    },
  },
  persist: true,
})
