import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useFullscreen } from '@vueuse/core'

export const useFullScreenStore = defineStore('fullScreen', () => {
  // State
  const isEditorFullscreen = ref(false)
  const isOutputFullscreen = ref(false)
  const lastActivePanel = ref(null)
  const showEditorButton = ref(false)
  const showOutputButton = ref(false)

  // Fullscreen handling using vueuse
  const editorContainer = ref(null)
  const outputContainer = ref(null)
  const { isFullscreen: isEditorFullscreenState, toggle: toggleEditorFullscreenState } = useFullscreen(editorContainer)
  const { isFullscreen: isOutputFullscreenState, toggle: toggleOutputFullscreenState } = useFullscreen(outputContainer)

  // Function to toggle fullscreen for the editor
  const toggleEditorFullscreen = async (container) => {
    editorContainer.value = container?.value || null
    if (isOutputFullscreen.value) {
      await toggleOutputFullscreenState()
      isOutputFullscreen.value = false
    }
    await toggleEditorFullscreenState()
    isEditorFullscreen.value = isEditorFullscreenState.value
    lastActivePanel.value = isEditorFullscreen.value ? 'editor' : null
    return isEditorFullscreen.value
  }

  // Function to toggle fullscreen for the output
  const toggleOutputFullscreen = async (container) => {
    outputContainer.value = container?.value || null
    if (isEditorFullscreen.value) {
      await toggleEditorFullscreenState()
      isEditorFullscreen.value = false
    }
    await toggleOutputFullscreenState()
    isOutputFullscreen.value = isOutputFullscreenState.value
    lastActivePanel.value = isOutputFullscreen.value ? 'output' : null
    return isOutputFullscreen.value
  }

  // Function to switch fullscreen between panels
  const switchFullscreenPanel = async (targetPanel, editorContainer, outputContainer) => {
    if (targetPanel === 'editor') {
      await toggleEditorFullscreen(editorContainer)
    } else if (targetPanel === 'output') {
      await toggleOutputFullscreen(outputContainer)
    }
  }

  // Watch fullscreen states to update button visibility
  watch(isEditorFullscreenState, (newValue) => {
    console.log('Editor fullscreen changed:', newValue)
    showOutputButton.value = newValue
  }, { immediate: true })

  watch(isOutputFullscreenState, (newValue) => {
    console.log('Output fullscreen changed:', newValue)
    showEditorButton.value = newValue
  }, { immediate: true })

  // Function to handle switching to editor
  const handleSwitchToEditor = async () => {
    const editorElement = document.querySelector('#editor-container')
    if (editorElement) {
      await switchFullscreenPanel('editor', { value: editorElement }, null)
      showEditorButton.value = false
    } else {
      console.error('Editor container not found')
    }
  }

  // Function to handle switching to output
  const handleSwitchToOutput = async () => {
    const outputElement = document.querySelector('#output-container')
    if (outputElement) {
      await switchFullscreenPanel('output', null, { value: outputElement })
      showOutputButton.value = false
      return true
    } else {
      console.error('Output container not found')
      return false
    }
  }

  return {
    isEditorFullscreen,
    isOutputFullscreen,
    lastActivePanel,
    showEditorButton,
    showOutputButton,
    toggleEditorFullscreen,
    toggleOutputFullscreen,
    switchFullscreenPanel,
    handleSwitchToEditor,
    handleSwitchToOutput
  }
})
