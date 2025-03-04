<template>
  <div ref="container" class="flex flex-col">
    <div class="flex flex-row items-center justify-between p-2 bg-gray-200 dark:bg-gray-700 rounded-t-lg">
      <div class="flex flex-wrap items-center gap-2 sm:gap-3">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Output</h2>
        <button v-if="isFullscreen && !isEditorFull" @click="switchToEditor"
          class="bg-yellow-300 hover:bg-yellow-400 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-gray-800 dark:text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm transition-colors">
          Editor
        </button>
        <button @click="toggleOutputTheme"
          class="hidden sm:flex items-center gap-1 sm:gap-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-2 sm:px-4 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm transition-colors"
          :class="{ 'bg-gray-500 dark:bg-gray-700': isOutputDark }">
          <span>Force Dark</span>
          <div class="relative inline-flex items-center">
            <input type="checkbox" v-model="isOutputDark" class="sr-only peer" @change="updateOutput" />
            <div
              class="w-6 sm:w-8 h-3 sm:h-4 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-2 sm:after:h-3 after:w-2 sm:after:w-3 after:transition-all peer-checked:bg-blue-500 dark:peer-checked:bg-blue-600">
            </div>
          </div>
        </button>
      </div>
      
      <!-- Desktop Actions -->
      <div class="hidden sm:flex flex-wrap items-center gap-2 sm:gap-3">
        <button @click="saveOutput"
          class="bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm transition-colors">
          Save
        </button>
        <button @click="shareOutput"
          class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm transition-colors">
          Share
        </button>
        <button @click="openInNewTab" class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white p-1 sm:p-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" height="20" width="20"
            class="feather feather-external-link sm:h-5 sm:w-5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </button>
        <button @click="toggleFullscreen"
          class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white px-2 py-1 transition-colors">
          <svg v-if="isFullscreen" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="feather feather-minimize sm:w-5 sm:h-5">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
          </svg>
          <svg v-else class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 4H4v4m4-4L3 9m13-5h4v4m-4-4l5 5m-5 11h4v-4m-4 4l5-5m-11 5H4v-4m4 4l-5-5" />
          </svg>
        </button>
      </div>
      
      <!-- Mobile Dropdown Menu -->
      <div class="sm:hidden">
        <EditorDropdownMenu>
          <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
            <div class="flex items-center justify-between gap-2">
              <span class="text-sm text-gray-700 dark:text-gray-300">Force Dark Mode</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="isOutputDark" class="sr-only peer" @change="updateOutput" />
                <div
                  class="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500 dark:peer-checked:bg-blue-600">
                </div>
              </label>
            </div>
          </div>
          <button @click="saveOutput"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
            Save as HTML File
          </button>
          <button @click="shareOutput"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
            Share Output
          </button>
          <button @click="openInNewTab"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
            Open in New Tab
          </button>
          <button @click="toggleFullscreen"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
            {{ isFullscreen ? 'Exit Fullscreen' : 'Fullscreen' }}
          </button>
        </EditorDropdownMenu>
      </div>
    </div>
    <div class="w-full h-[300px] sm:h-[400px] md:h-[calc(100vh-300px)] lg:h-[calc(100vh-200px)] p-2 sm:p-4 rounded-b-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-auto"
      :class="{ 'h-screen': isFullscreen }">
      <iframe ref="outputFrame" class="w-full h-full border-none" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useFullscreen, useLocalStorage } from '@vueuse/core'
import EditorDropdownMenu from './EditorDropdownMenu.vue'

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

const saveOutput = () => {
  // Create the HTML content with proper DOCTYPE and structure
  const fullHtmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Saved HTML</title>
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
${props.htmlCode}
</body>
</html>`;

  // Create a Blob with the HTML content
  const blob = new Blob([fullHtmlContent], { type: 'text/html' });
  
  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary anchor element to trigger the download
  const a = document.createElement('a');
  a.href = url;
  a.download = 'output.html';
  
  // Append to the document, click it, and remove it
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
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