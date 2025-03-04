<template>
  <div ref="container" class="flex flex-col">
    <div class="flex items-center justify-between p-2 bg-gray-200 dark:bg-gray-700 rounded-t-lg">
      <div class="flex gap-3">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Output</h2>
        <button v-if="isFullscreen && !isEditorFull" @click="switchToEditor"
          class="bg-yellow-300 hover:bg-yellow-400 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-gray-800 dark:text-white px-4 py-1.5 rounded-md text-sm transition-colors">
          Editor
        </button>
        <button @click="toggleOutputTheme"
          class="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-4 py-1.5 rounded-md text-sm transition-colors"
          :class="{ 'bg-gray-500 dark:bg-gray-700': isOutputDark }">
          <span>Force Dark</span>
          <div class="relative inline-flex items-center">
            <input type="checkbox" v-model="isOutputDark" class="sr-only peer" @change="updateOutput" />
            <div
              class="w-8 h-4 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-500 dark:peer-checked:bg-blue-600">
            </div>
          </div>
        </button>
      </div>
      <div class="flex items-center gap-3">
        <button @click="shareOutput"
          class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm transition-colors">
          Share
        </button>
        <button @click="openInNewTab" class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" height="24"
            class="feather feather-external-link">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </button>
        <button @click="toggleFullscreen"
          class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white pr-4 py-1.5 transition-colors">
          <svg v-if="isFullscreen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="feather feather-minimize">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 4H4v4m4-4L3 9m13-5h4v4m-4-4l5 5m-5 11h4v-4m-4 4l5-5m-11 5H4v-4m4 4l-5-5" />
          </svg>
        </button>
      </div>
    </div>
    <div class="w-full h-[calc(100vh-200px)] p-4 rounded-b-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-auto"
      :class="{ 'h-screen': isFullscreen }">
      <iframe ref="outputFrame" class="w-full h-full border-none" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useFullscreen, useLocalStorage } from '@vueuse/core'

const props = defineProps({
  htmlCode: {
    type: String,
    default: ''
  },
  isEditorFull: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['share-output', 'switch-to-editor'])

// Template refs and state
const container = ref(null)
const outputFrame = ref(null)
const isOutputDark = useLocalStorage('editor-output-dark', false)

// Fullscreen handling
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(container)

// Computed properties
const baseTemplate = computed(() => `
  <!DOCTYPE html>
  <html style="height: 100%;">
  <head>
    <style>
      html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
        background-color: ${isOutputDark.value ? 'oklch(0.278 0.033 256.848)' : '#ffffff'};
        color: #000000;
        font-family: Arial, sans-serif;
      }
    </style>
  </head>
  <body>
`)

// Methods
const updateOutput = () => {
  const iframe = outputFrame.value
  if (iframe) {
    const doc = iframe.contentDocument || iframe.contentWindow.document
    doc.open()
    doc.write(`
      ${baseTemplate.value}
      ${props.htmlCode}
      </body>
      </html>
    `)
    doc.close()
  }
}

const openInNewTab = () => {
  window.open('/output?run=true', 'output')
}

const toggleOutputTheme = () => {
  isOutputDark.value = !isOutputDark.value
  updateOutput()
}

const shareOutput = () => {
  emit('share-output')
}

const switchToEditor = () => {
  emit('switch-to-editor')
}

watch(isOutputDark, updateOutput)

// Initialize
onMounted(updateOutput)

// Expose methods for parent component
defineExpose({
  toggleFullscreen,
  isFullscreen,
  updateOutput
})
</script> 