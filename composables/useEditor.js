import { ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useRoute, useRouter } from 'nuxt/app'
import { useEditorStore } from '~/stores/editor'

export function useEditor() {
  const route = useRoute()
  const router = useRouter()
  const editorStore = useEditorStore()
  const { compress, decompress } = useBrotli()
  const { generateQr } = useQr()

  // DEPRECATED: Debounced update for URL sharing
  const debouncedUpdateUrl = useDebounceFn(() => {
    updateUrlWithCode()
  }, 500)

  // Function to update URL with current code using hash
  const updateUrlWithCode = async () => {
    const compressedCode = await compress(editorStore.htmlCode)
    const encodedCode = encodeURIComponent(compressedCode)
    router.push({
      hash: `#code=${encodedCode}`
    })
  }

  // Function to load code from URL hash
  const getCodeFromUrl = async () => {
    const hash = route.hash.slice(1) // Remove the '#' prefix
    const params = new URLSearchParams(hash)
    const compressedCode = params.get('code')
    if (compressedCode) {
      const decompressedCode = await decompress(decodeURIComponent(compressedCode))
      return decompressedCode;
    }

    return '';
  }

  const loadEditorFromUrl = async () => {
      const code = await getCodeFromUrl()
      if(code) editorStore.setHtmlCode(code)
  }

  // Share code function using hash
  const shareCode = async () => {
    const compressedCode = await compress(editorStore.htmlCode)
    const encodedCode = encodeURIComponent(compressedCode)
    const shareUrl = `${window.location.origin}${route.path}#code=${encodedCode}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      generateQr(shareUrl)
    } catch (err) {
      console.error('Failed to copy URL: ', err)
    }
  }

  // Share output function using hash
  const shareOutput = async () => {
    const compressedCode = await compress(editorStore.htmlCode)
    const encodedCode = encodeURIComponent(compressedCode)
    const shareUrl = `${window.location.origin}/output#code=${encodedCode}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      generateQr(shareUrl)
    } catch (err) {
      console.error('Failed to copy URL: ', err)
    }
  }

  return {
    getCodeFromUrl,
    loadEditorFromUrl,
    shareCode,
    shareOutput,
    updateUrlWithCode,
    debouncedUpdateUrl
  }
}