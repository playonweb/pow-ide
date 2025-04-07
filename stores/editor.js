import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', {
  state: () => ({
    htmlCode: '<h1>Hello World</h1>\n<p>Start editing to see the output!</p>',
    liveRun: true,
    isOutputDark: false,
    isEditorFullscreen: false,
    isOutputFullscreen: false,
    fullscreenSwitch: 0, // New counter to trigger fullscreen events
  }),
  actions: {
    setHtmlCode(code) {
      this.htmlCode = code
    },
    setLiveRun(value) {
      this.liveRun = value
    },
    setOutputDark(value) {
      this.isOutputDark = value
    },
    setEditorFullscreen(value) {
      this.isEditorFullscreen = value
      if (value) this.isOutputFullscreen = false
    },
    setOutputFullscreen(value) {
      this.isOutputFullscreen = value
      if (value) this.isEditorFullscreen = false
    },
    toggleEditorFullscreen() {
      this.isEditorFullscreen = !this.isEditorFullscreen
      if (this.isEditorFullscreen) this.isOutputFullscreen = false
    },
    toggleOutputFullscreen() {
      this.isOutputFullscreen = !this.isOutputFullscreen
      if (this.isOutputFullscreen) this.isEditorFullscreen = false
    },
    // New action to trigger fullscreen panel switching
    triggerFullscreenSwitch(targetPanel) {
      if (targetPanel === 'editor') {
        this.isOutputFullscreen = false;
        this.isEditorFullscreen = true;
      } else if (targetPanel === 'output') {
        this.isEditorFullscreen = false;
        this.isOutputFullscreen = true;
      }
      this.fullscreenSwitch++; // Increment to trigger watchers
    }
  },
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
    pick: ['htmlCode', 'liveRun', 'isOutputDark'],
  },
})
