import { ref, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useRoute, useRouter } from 'nuxt/app'
import { useEditorStore } from '~/stores/editor'

export function useEditor() {
  const route = useRoute()
  const router = useRouter()
  const editorStore = useEditorStore()
  const liveSync = ref(false)
  const { compress, decompress } = useBrotli();
  const { generateQr } = useQr();

  // Debounced update for URL sharing
  const debouncedUpdateUrl = useDebounceFn(() => {
    updateUrlWithCode()
  }, 500)

  // Function to update URL with current code
  const updateUrlWithCode = () => {
    const encodedCode = encodeURIComponent(editorStore.htmlCode)
    router.push({
      query: {
        ...route.query, // Preserve other query params
        code: encodedCode
      }
    })
  }

  // Function to load code from URL
  const loadCodeFromUrl = async () => {
    const code = route.query.code
    if (code) {
      editorStore.setHtmlCode(await decompress(decodeURIComponent(code)))
    }
  }

  // Share code function
  const shareCode = async () => {
    const encodedCode = encodeURIComponent(await compress(editorStore.htmlCode))
    const shareUrl = `${window.location.origin}${route.path}?code=${encodedCode}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      generateQr(shareUrl);
    } catch (err) {
      console.error('Failed to copy URL: ', err)
    }
  }

  // Share output function
  const shareOutput = async () => {
    const encodedCode = encodeURIComponent(await compress(editorStore.htmlCode))
    const shareUrl = `${window.location.origin}/output?code=${encodedCode}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      generateQr(shareUrl);
    } catch (err) {
      console.error('Failed to copy URL: ', err)
    }
  }

  return {
    editorStore,
    liveSync,
    loadCodeFromUrl,
    shareCode,
    shareOutput,
    updateUrlWithCode,
    debouncedUpdateUrl
  }
} 