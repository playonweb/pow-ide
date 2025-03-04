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
    
    <!-- CodeMirror Editor -->
    <div
      class="relative w-full h-[calc(100vh-200px)] border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-lg overflow-hidden"
      :class="{ 'h-screen': isFullscreen }">
      <ClientOnly>
        <div ref="editorContainer" class="w-full h-full rounded-b-lg"></div>
        <!-- Placeholder for SSR -->
        <template #fallback>
          <div class="w-full h-full p-4 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 font-mono text-sm">
            Loading editor...
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { useColorMode } from '#imports'
import { EditorView, basicSetup } from 'codemirror'
import { html } from '@codemirror/lang-html'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorState } from '@codemirror/state'

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
const editorContainer = ref(null)
const editorView = ref(null)

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

// Binding live sync
const liveSync = computed({
  get: () => props.liveSync,
  set: (value) => {
    emit('update:liveSync', value)
  }
})

// Setup CodeMirror editor
const setupEditor = () => {
  if (!editorContainer.value) return;
  
  // Create the editor state
  const startState = EditorState.create({
    doc: props.modelValue,
    extensions: [
      basicSetup,
      html(),
      isDarkMode.value ? oneDark : [],
      EditorView.updateListener.of(update => {
        if (update.docChanged) {
          // Update the modelValue when content changes
          const newValue = update.state.doc.toString();
          emit('update:modelValue', newValue);
          
          // If live sync is enabled, trigger run
          if (liveSync.value) {
            emit('run');
          }
        }
      }),
      EditorView.theme({
        "&": {
          height: "100%",
          fontSize: "14px"
        },
        ".cm-scroller": {
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          overflow: "auto"
        }
      })
    ]
  });

  // Create the editor view
  editorView.value = new EditorView({
    state: startState,
    parent: editorContainer.value
  });
}

// Methods
const runCode = () => {
  emit('run');
}

const shareCode = () => {
  emit('share');
}

const switchToOutput = () => {
  emit('switch-to-output');
}

// Update editor content when modelValue changes externally
watch(() => props.modelValue, (newValue) => {
  if (editorView.value && newValue !== editorView.value.state.doc.toString()) {
    editorView.value.dispatch({
      changes: {
        from: 0,
        to: editorView.value.state.doc.length,
        insert: newValue
      }
    });
  }
});

// Update editor theme when dark mode changes
watch(isDarkMode, async () => {
  if (editorView.value) {
    // We need to recreate the editor when changing theme
    editorView.value.destroy();
    await nextTick();
    setupEditor();
  }
});

// Update editor when fullscreen changes
watch(isFullscreen, async () => {
  await nextTick();
  if (editorView.value) {
    editorView.value.requestMeasure();
  }
});

// Initialize editor on component mount
onMounted(() => {
  nextTick(() => {
    setupEditor();
  });
});

// Cleanup on component unmount
onUnmounted(() => {
  if (editorView.value) {
    editorView.value.destroy();
  }
});

// Expose methods for parent component
defineExpose({
  toggleFullscreen,
  isFullscreen
})
</script>

<style>
/* Add any custom styles for CodeMirror */
.cm-editor {
  height: 100%;
}

.cm-editor.cm-focused {
  outline: none !important;
}

/* Style the gutters */
.cm-gutters {
  border-right: 1px solid #ddd;
}

.dark .cm-gutters {
  border-right: 1px solid #444;
}
</style> 