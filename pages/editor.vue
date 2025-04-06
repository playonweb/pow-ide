<template>
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
        <!-- Header -->
        <EditorHeader />
        <ClientOnly>

            <EditorShowQr />
        </ClientOnly>
        <!-- Main Content -->
        <main class="flex-1 flex flex-col md:flex-row p-2 md:p-4 gap-4 max-w-7xl mx-auto w-full">
            <!-- Editor Panel -->
            <div class="w-full md:w-1/2 mb-4 md:mb-0">
                <EditorPanel
                    ref="editorPanel"
                    v-model="editorStore.htmlCode"
                    v-model:liveSync="liveSync"
                    :isOutputFull="isOutputFull"
                    @run="updateOutput"
                    @share="shareCode"
                    @switch-to-output="switchToOutput"
                />
            </div>

            <!-- Output Panel -->
            <div class="w-full md:w-1/2">
                <ClientOnly>
                <OutputPanel
                    ref="outputPanel"
                    :htmlCode="editorStore.htmlCode"
                    :isEditorFull="isEditorFull"
                    @share-output="shareOutput"
                    @switch-to-editor="switchToEditor"
                />
                </ClientOnly>
            </div>
        </main>
    </div>
</template>

<script setup>
import EditorHeader from '~/components/editor/EditorHeader.vue'
import EditorPanel from '~/components/editor/EditorPanel.vue'
import OutputPanel from '~/components/editor/OutputPanel.vue'
import { useEditorStore } from '~/stores/editor'

// Setup editor functionality
const { liveSync, loadEditorFromUrl, shareCode, shareOutput } = useEditor()
const editorStore = useEditorStore()
// Template refs
const editorPanel = ref(null)
const outputPanel = ref(null)

// Computed properties for fullscreen states
const isEditorFull = computed(() => editorPanel.value?.isFullscreen || false)
const isOutputFull = computed(() => outputPanel.value?.isFullscreen || false)

// Method to update output
const updateOutput = () => {
    outputPanel.value?.updateOutput()
}

// Methods for switching between editor and output in fullscreen
const switchToOutput = async () => {
    updateOutput()
    await editorPanel.value?.toggleFullscreen() // Exit editor fullscreen
    await outputPanel.value?.toggleFullscreen() // Enter output fullscreen
}

const switchToEditor = async () => {
    await outputPanel.value?.toggleFullscreen() // Exit output fullscreen
    await editorPanel.value?.toggleFullscreen() // Enter editor fullscreen
}

// Watch htmlCode from store for live updates
watch(() => editorStore.htmlCode, () => {
    useRouter().replace({ path: useRoute.path, query: {} })
    if (liveSync.value) {
        updateOutput()
    }
})

// Initial setup
onMounted(async () => {
    await loadEditorFromUrl()
    updateOutput()
})
</script>