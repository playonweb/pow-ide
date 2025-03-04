<template>
  <div ref="container" class="flex flex-col">
    <div class="flex items-center justify-between p-2 bg-gray-200 dark:bg-gray-700 rounded-t-lg">
      <div class="flex gap-3">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">HTML Code</h2>
        <button v-if="isFullscreen && !isOutputFull" @click="switchToOutput"
          class="bg-yellow-300 hover:bg-yellow-400 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-gray-800 dark:text-white px-4 py-1.5 rounded-md text-sm transition-colors">
          Output
        </button>
        <label v-if="isFullscreen" class="relative inline-flex items-center cursor-pointer mt-2">
          <input type="checkbox" v-model="isDarkMode" class="sr-only peer" />
          <div
            class="w-11 h-6 bg-black peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 dark:peer-checked:bg-blue-600">
            <span class="absolute left-1 top-1 text-xs text-gray-600">☀️</span>
            <span class="absolute right-1 top-1 text-xs text-white">🌙</span>
          </div>
        </label>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-700 dark:text-gray-300">Live</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="liveSync" class="sr-only peer" />
            <div
              class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 dark:peer-checked:bg-blue-600">
            </div>
          </label>
        </div>
        <button @click="runCode" :disabled="liveSync"
          class="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-4 py-1.5 rounded-md text-sm disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
          Run
        </button>
        <button @click="shareCode"
          class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm transition-colors">
          Share
        </button>
        <button @click="toggleFullscreen"
          class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white pr-2 py-1.5 transition-colors">
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
    <textarea v-model="htmlCode" @input="onInput"
      class="w-full h-[calc(100vh-200px)] p-4 rounded-b-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      :class="{ 'h-screen': isFullscreen }" placeholder="Enter your HTML code here..." />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { useColorMode } from '#imports'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  liveSync: {
    type: Boolean,
    default: false
  },
  isOutputFull: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'update:liveSync', 'run', 'share', 'switch-to-output'])

// Template refs
const container = ref(null)

// Fullscreen handling
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(container)

// Color mode
const colorMode = useColorMode()
const isDarkMode = computed({
  get: () => colorMode.value === 'dark',
  set: (value) => {
    colorMode.preference = value ? 'dark' : 'light'
  }
})

// Binding model value
const htmlCode = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})

// Binding live sync
const liveSync = computed({
  get: () => props.liveSync,
  set: (value) => {
    emit('update:liveSync', value)
  }
})

// Methods
const onInput = () => {
  if (liveSync.value) {
    emit('run')
  }
}

const runCode = () => {
  emit('run')
}

const shareCode = () => {
  emit('share')
}

const switchToOutput = () => {
  emit('switch-to-output')
}

// Expose methods for parent component
defineExpose({
  toggleFullscreen,
  isFullscreen
})
</script> 