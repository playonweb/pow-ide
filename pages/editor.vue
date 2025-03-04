<template>
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
        <!-- Header -->
        <header class="bg-white dark:bg-gray-800 shadow-sm p-4 sticky top-0 z-10">
            <div class="max-w-7xl mx-auto flex items-center justify-between">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">PoW IDE</h1>
                <DarkMode />
            </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1 flex p-4 gap-4 max-w-7xl mx-auto w-full">
            <!-- Editor Panel -->
            <div ref="editorContainer" class="w-1/2 flex flex-col">
                <div class="flex items-center justify-between p-2 bg-gray-200 dark:bg-gray-700 rounded-t-lg">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">HTML Code</h2>
                    <div class="flex items-center gap-3">
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-700 dark:text-gray-300">Live</span>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" v-model="liveSync" class="sr-only peer" />
                                <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 dark:peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <button @click="runCode" :disabled="liveSync" class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
                            Run
                        </button>
                        <!-- Share Button -->
                        <button @click="shareCode" class="bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white px-4 py-1.5 rounded-md text-sm transition-colors">
                            Share
                        </button>
                        <button v-if="isEditorFull && !isOutputFull" @click="switchToOutput" class="bg-green-300 hover:bg-green-400 dark:bg-green-500 dark:hover:bg-green-600 text-gray-800 dark:text-white px-4 py-1.5 rounded-md text-sm transition-colors">
                            Output
                        </button>
                        <!-- Dark mode toggle in fullscreen -->
                        <label v-if="isEditorFull" class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" v-model="isDarkMode" class="sr-only peer" />
                            <div class="w-11 h-6 bg-black peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 dark:peer-checked:bg-blue-600">
                                <span class="absolute left-1 top-1 text-xs text-gray-600">☀️</span>
                                <span class="absolute right-1 top-1 text-xs text-white">🌙</span>
                            </div>
                        </label>
                        <button @click="toggleEditorFullScreen" class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white pr-2 py-1.5 transition-colors">
                            <svg v-if="isEditorFull" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-minimize">
                                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                            </svg>
                            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 4H4v4m4-4L3 9m13-5h4v4m-4-4l5 5m-5 11h4v-4m-4 4l5-5m-11 5H4v-4m4 4l-5-5" />
                            </svg>
                        </button>
                    </div>
                </div>
                <textarea v-model="htmlCode" @input="liveSync && debouncedUpdate()" class="w-full h-[calc(100vh-200px)] p-4 rounded-b-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400" :class="{ 'h-screen': isEditorFull }" placeholder="Enter your HTML code here..." />
            </div>

            <!-- Output Panel -->
            <div ref="outputContainer" class="w-1/2 flex flex-col">
                <div class="flex items-center justify-between p-2 bg-gray-200 dark:bg-gray-700 rounded-t-lg">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Output</h2>
                    <div class="flex items-center gap-3">
                        <button v-if="isOutputFull && !isEditorFull" @click="switchToEditor" class="bg-green-300 hover:bg-green-400 dark:bg-green-500 dark:hover:bg-green-600 text-gray-800 dark:text-white px-4 py-1.5 rounded-md text-sm transition-colors">
                            Editor
                        </button>
                        <button @click="toggleOutputTheme" class="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-4 py-1.5 rounded-md text-sm transition-colors" :class="{ 'bg-gray-500 dark:bg-gray-700': isOutputDark }">
                            <span>Force Dark</span>
                            <div class="relative inline-flex items-center">
                                <input type="checkbox" v-model="isOutputDark" class="sr-only peer" @change="updateOutput" />
                                <div class="w-8 h-4 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-500 dark:peer-checked:bg-blue-600"></div>
                            </div>
                        </button>
                        <button @click="openInNewTab" class="text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" height="24" class="feather feather-external-link">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </button>
                        <button @click="toggleOutputFullScreen" class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white pr-4 py-1.5 transition-colors">
                            <svg v-if="isOutputFull" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-minimize">
                                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                            </svg>
                            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 4H4v4m4-4L3 9m13-5h4v4m-4-4l5 5m-5 11h4v-4m-4 4l5-5m-11 5H4v-4m4 4l-5-5" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="w-full h-[calc(100vh-200px)] p-4 rounded-b-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-auto" :class="{ 'h-screen': isOutputFull }">
                    <iframe ref="outputFrame" class="w-full h-full border-none" />
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useDebounceFn, useFullscreen, useLocalStorage } from '@vueuse/core'
import { useRoute, useRouter } from 'nuxt/app'

// Nuxt routing
const route = useRoute()
const router = useRouter()

// State
const htmlCode = ref('<h1>Hello World</h1>\n<p>Start editing to see the output!</p>')
const outputFrame = ref(null)
const liveSync = ref(false)
const editorContainer = ref(null)
const outputContainer = ref(null)
const isOutputDark = useLocalStorage('editor-output-dark', false)
const colorMode = useColorMode()

// Reactive dark mode state
const isDarkMode = computed({
    get: () => colorMode.value === 'dark',
    set: (value) => {
        colorMode.preference = value ? 'dark' : 'light'
    }
})

// Fullscreen setup
const { isFullscreen: isEditorFull, toggle: toggleEditorFull } = useFullscreen(editorContainer)
const { isFullscreen: isOutputFull, toggle: toggleOutputFull } = useFullscreen(outputContainer)

// Base HTML template with toggleable background
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

// Update output function
const updateOutput = () => {
    const iframe = outputFrame.value
    if (iframe) {
        const doc = iframe.contentDocument || iframe.contentWindow.document
        doc.open()
        doc.write(`
      ${baseTemplate.value}
      ${htmlCode.value}
      </body>
      </html>
    `)
        doc.close()
    }
}

// Open in new tab function
const openInNewTab = () => {
    const newWindow = window.open('', '_blank')
    if (newWindow) {
        newWindow.document.open()
        newWindow.document.write(`
      ${baseTemplate.value}
      ${htmlCode.value}
      </body>
      </html>
    `)
        newWindow.document.close()
    } else {
        alert('Please allow popups for this website to open the code output in a new tab')
    }
}

// Debounced update for live preview and URL sharing
const debouncedUpdate = useDebounceFn(() => {
    updateOutput()
    updateUrlWithCode()
}, 500)

// Run code manually
const runCode = () => {
    if (!liveSync.value) {
        updateOutput()
    }
}

// Toggle output theme
const toggleOutputTheme = () => {
    isOutputDark.value = !isOutputDark.value
    updateOutput()
}

// Full screen toggles and switches
const toggleEditorFullScreen = async () => {
    await toggleEditorFull()
}

const toggleOutputFullScreen = async () => {
    await toggleOutputFull()
}

const switchToOutput = async () => {
    await toggleEditorFull() // Exit editor fullscreen
    await toggleOutputFull() // Enter output fullscreen
}

const switchToEditor = async () => {
    await toggleOutputFull() // Exit output fullscreen
    await toggleEditorFull() // Enter editor fullscreen
}

// Function to update URL with current code using Nuxt router
const updateUrlWithCode = () => {
    const encodedCode = encodeURIComponent(htmlCode.value)
    router.push({
        query: {
            ...route.query, // Preserve other query params if any
            code: encodedCode
        }
    })
}

// Function to load code from URL
const loadCodeFromUrl = () => {
    const code = route.query.code
    if (code) {
        htmlCode.value = decodeURIComponent(code)
        updateOutput()
    }
}

// Share code function
const shareCode = async () => {
    const encodedCode = encodeURIComponent(htmlCode.value)
    const shareUrl = `${window.location.origin}${route.path}?code=${encodedCode}`
    
    try {
        await navigator.clipboard.writeText(shareUrl)
        alert('Share URL copied to clipboard: ' + shareUrl)
    } catch (err) {
        console.error('Failed to copy URL: ', err)
        alert('Failed to copy URL. Here it is: ' + shareUrl)
    }
}

// Watch fullscreen state to adjust layout
watch([isEditorFull, isOutputFull], ([editorFull, outputFull]) => {
    if (editorFull || outputFull) {
        const container = editorFull ? editorContainer.value : outputContainer.value
        const titleBar = container.querySelector('.bg-gray-200, .dark\\:bg-gray-700')
        if (titleBar) titleBar.classList.remove('mb-4')
    } else {
        const containers = [editorContainer.value, outputContainer.value]
        containers.forEach(container => {
            const titleBar = container.querySelector('.bg-gray-200, .dark\\:bg-gray-700')
            if (titleBar && !titleBar.classList.contains('mb-4')) {
                titleBar.classList.add('mb-4')
            }
        })
    }
})

// Watch dark mode and liveSync changes
watch(isDarkMode, () => {
    if (liveSync.value) {
        updateOutput()
    }
})

// Watch htmlCode for live updates
watch(htmlCode, () => {
    if (liveSync.value) {
        debouncedUpdate()
    }
})

// Watch route changes to update code (for back/forward navigation)
watch(() => route.query.code, (newCode) => {
    if (newCode) {
        htmlCode.value = decodeURIComponent(newCode)
        updateOutput()
    }
})

// Initial render and URL loading
onMounted(() => {
    loadCodeFromUrl()
    updateOutput()
})
</script>