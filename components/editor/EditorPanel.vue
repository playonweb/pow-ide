<template>
  <div ref="container" class="flex flex-col">
    <div class="flex flex-row items-center justify-between p-2 bg-gray-200 dark:bg-gray-700 rounded-t-lg">
      <div class="flex flex-wrap items-center gap-2 sm:gap-3">
        <div class="relative">
          <button class="text-2xl text-red-500" @click.stop="showMenu">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :stroke="isDarkMode ? 'white' : 'black'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu w-6 h-6">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <BoilerplateMenu v-model="showMenuPopup" @select="loadBoilerplate" />
        </div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">HTML Code</h2>
        <button v-if="isFullscreen && !isOutputFull" @click="switchToOutput"
          class="bg-yellow-300 hover:bg-yellow-400 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-gray-800 dark:text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm transition-colors">
          Output
        </button>
        <label v-if="isFullscreen" class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="isDarkMode" class="sr-only peer" />
          <div
            class="w-11 h-6 bg-black peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 dark:peer-checked:bg-blue-600">
            <span class="absolute left-1 top-1 text-xs text-gray-600">☀️</span>
            <span class="absolute right-1 top-1 text-xs text-white">🌙</span>
          </div>
        </label>
      </div>
      
      <!-- Desktop Actions -->
      <div class="hidden sm:flex flex-wrap items-center gap-2 sm:gap-3">
        <div class="flex items-center gap-1 sm:gap-2">
          <span class="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Live</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="liveSync" class="sr-only peer" />
            <div
              class="w-9 sm:w-11 h-5 sm:h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 sm:after:h-5 after:w-4 sm:after:w-5 after:transition-all peer-checked:bg-blue-500 dark:peer-checked:bg-blue-600">
            </div>
          </label>
        </div>
        <button @click="runCode" :disabled="liveSync"
          class="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
          Run
        </button>
        <button @click="saveCode"
          class="bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm transition-colors">
          Save
        </button>
        <button @click="shareCode"
          class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm transition-colors">
          {{ shareButtonText }}
        </button>
        <button @click="toggleFullscreen"
          class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white px-2 py-1 transition-colors">
          <svg v-if="isFullscreen" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="feather feather-minimize sm:w-6 sm:h-6">
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
              <span class="text-sm text-gray-700 dark:text-gray-300">Live Updates</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="liveSync" class="sr-only peer" />
                <div
                  class="w-9 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500 dark:peer-checked:bg-blue-600">
                </div>
              </label>
            </div>
          </div>
          <button @click="runCode" :disabled="liveSync"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:hover:bg-white dark:disabled:hover:bg-gray-700 disabled:cursor-not-allowed">
            Run Code
          </button>
          <button @click="saveCode"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
            Save as HTML File
          </button>
          <button @click="shareCode"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
            {{ shareButtonText }}
          </button>
          <button @click="toggleFullscreen"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
            {{ isFullscreen ? 'Exit Fullscreen' : 'Fullscreen' }}
          </button>
        </EditorDropdownMenu>
      </div>
    </div>
    
    <!-- CodeMirror Editor -->
    <div
      class="relative w-full h-[300px] sm:h-[400px] md:h-[calc(100vh-300px)] lg:h-[calc(100vh-200px)] border border-gray-300 dark:border-gray-700 rounded-b-lg overflow-hidden"
      :class="{ '!h-[calc(100vh-44px)] !max-h-[calc(100vh-44px)]': isFullscreen }">
      <ClientOnly>
        <div class="w-full h-full">
          <div ref="editorContainer" class="w-full h-full rounded-b-lg" :class="{'dark-editor': isDarkMode}"></div>
        </div>
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
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue'
import { useFullscreen, useMagicKeys } from '@vueuse/core'
import { useColorMode } from '#imports'
import { EditorView, basicSetup } from 'codemirror'
import { html } from '@codemirror/lang-html'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorState } from '@codemirror/state'
import EditorDropdownMenu from './EditorDropdownMenu.vue'
import BoilerplateMenu from './BoilerplateMenu.vue'

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

// Add to the top-level variables in script setup
const shareButtonText = ref('Share')

// Add keyboard monitoring only for paste event
const keys = useMagicKeys()

// Just monitor Ctrl+V for paste events
const { ctrl_v, meta_v } = keys
const isPaste = computed(() => ctrl_v.value || meta_v.value)

watch(isPaste, (newValue) => {
  if (newValue && liveSync.value) {
    // Small delay to allow editor to update with pasted content
    setTimeout(() => {
      runCode();
    }, 100);
  }
})

// Setup CodeMirror editor with more explicit theme handling
const setupEditor = () => {
  if (!editorContainer.value) return;
  
  // Define extensions array based on dark mode
  const extensions = [
    basicSetup,
    html(),
    EditorView.theme({
      "&": {
        backgroundColor: isDarkMode.value ? "#282c34" : "#ffffff",
        color: isDarkMode.value ? "#abb2bf" : "#24292e"
      },
      ".cm-content": {
        caretColor: isDarkMode.value ? "#528bff" : "#000000"
      },
      ".cm-cursor": {
        borderLeftColor: isDarkMode.value ? "#528bff" : "#000000"
      },
      "&.cm-focused .cm-cursor": {
        borderLeftColor: isDarkMode.value ? "#528bff" : "#000000"
      },
      ".cm-selectionBackground": {
        backgroundColor: isDarkMode.value ? "#3E4451" : "#b3d4fc"
      },
      ".cm-gutters": {
        backgroundColor: isDarkMode.value ? "#282c34" : "#f6f8fa",
        color: isDarkMode.value ? "#495162" : "#6e7781",
        border: "none"
      }
    }),
    EditorView.updateListener.of(update => {
      if (update.docChanged) {
        const newValue = update.state.doc.toString();
        emit('update:modelValue', newValue);
        if (liveSync.value) {
          emit('run');
        }
      }
    })
  ];
  
  // Only add oneDark theme when in dark mode
  if (isDarkMode.value) {
    extensions.push(oneDark);
  }
  
  // Create the editor state with the appropriate extensions
  const startState = EditorState.create({
    doc: props.modelValue,
    extensions: extensions
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
  emit('share')
  shareButtonText.value = 'Copied!'
  setTimeout(() => {
    shareButtonText.value = 'Share'
  }, 2000)
}

const saveCode = () => {
  // Create the HTML content with proper DOCTYPE and structure
  const fullHtmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Saved HTML</title>
</head>
<body>
${props.modelValue}
</body>
</html>`;

  // Create a Blob with the HTML content
  const blob = new Blob([fullHtmlContent], { type: 'text/html' });
  
  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary anchor element to trigger the download
  const a = document.createElement('a');
  a.href = url;
  a.download = 'code.html';
  
  // Append to the document, click it, and remove it
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}

const switchToOutput = () => {
  emit('switch-to-output');
}

// Boilerplate menu toggle
const showMenuPopup = ref(false)

// Show menu method - added .stop to prevent event propagation
const showMenu = (event) => {
  if (event) {
    event.stopPropagation();
  }
  showMenuPopup.value = !showMenuPopup.value;
}

// Method to load boilerplate content
const loadBoilerplate = (fileName) => {
  fetch(`boilerplates/${fileName}`)  // Removed leading slash to make path relative
    .then(res => res.text())
    .then(text => {
      emit('update:modelValue', text);
      runCode(); // Automatically run the code when loading a boilerplate
    })
    .catch(err => {
      console.error('Error loading boilerplate:', err);
    });
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
    // Store cursor position and selection
    const currentValue = editorView.value.state.doc.toString();
    const selection = editorView.value.state.selection;
    
    // Destroy and recreate with new theme
    editorView.value.destroy();
    await nextTick();
    setupEditor();
    
    // Try to restore cursor position if possible
    if (editorView.value) {
      try {
        editorView.value.dispatch({
          selection: selection
        });
      } catch (e) {
        console.warn('Could not restore selection after theme change', e);
      }
    }
  }
});

// Update editor when fullscreen changes
watch(isFullscreen, async () => {
  await nextTick();
  if (editorView.value) {
    // Allow time for the DOM to update before triggering a remeasure
    setTimeout(() => {
      editorView.value.requestMeasure();
      // Force a refresh of the editor layout
      const view = editorView.value;
      view.dispatch({});
    }, 100);
  }
});

// Initialize editor on component mount
onMounted(() => {
  nextTick(() => {
    setupEditor();
  });
});

// Expose methods for parent component
defineExpose({
  toggleFullscreen,
  isFullscreen
})

// Clean up only the editor view on unmount
onUnmounted(() => {
  if (editorView.value) {
    editorView.value.destroy();
  }
});
</script>
<style>
/* Dirty fix editor scrollbar */
.cm-editor {
  height: 100%;
}
</style>
