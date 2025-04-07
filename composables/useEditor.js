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
  
  // Shared UI state
  const shareButtonText = ref('Share')
  
  // Using a direct function to get the iframe rather than storing a reference
  const getOutputIframe = () => {
    // Try to get the iframe element directly
    return document.querySelector('iframe') || null
  }

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
      shareButtonText.value = 'Copied!'
      setTimeout(() => {
        shareButtonText.value = 'Share'
      }, 2000)
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
      shareButtonText.value = 'Copied!'
      setTimeout(() => {
        shareButtonText.value = 'Share'
      }, 2000)
    } catch (err) {
      console.error('Failed to copy URL: ', err)
    }
  }

  // Function to update output iframe with current code - now gets iframe directly
  const updateOutput = () => {
    const iframe = getOutputIframe()
    
    if (!iframe) {
      console.warn('Output iframe not found in DOM')
      // We'll retry after a short delay
      setTimeout(() => {
        updateOutput()
      }, 100)
      return
    }
    
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document
      doc.open()
      doc.write(`
        <!DOCTYPE html>
        <html style="height: 100%;">
        <head>
          <style>
            html, body {
              margin: 0;
              padding: 0;
              height: 100%;
              width: 100%;
              background-color: ${editorStore.isOutputDark ? 'oklch(0.278 0.033 256.848)' : '#ffffff'};
              color: #000000;
              font-family: Arial, sans-serif;
            }
          </style>
        </head>
        <body>
        ${editorStore.htmlCode}
        </body>
        </html>
      `)
      doc.close()
    } catch (error) {
      console.error('Error updating output:', error)
    }
  }
  
  // Method for switching between editor and output - simplified to use the store trigger
  const switchToOutput = () => {
    editorStore.triggerFullscreenSwitch('output')
    updateOutput()
  }

  const switchToEditor = () => {
    editorStore.triggerFullscreenSwitch('editor')
  }
  
  const runCode = () => {
    updateOutput()
  }
  
  // Method to save HTML code to a file
  const saveCode = () => {
    const fullHtmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Saved HTML</title>
</head>
<body>
${editorStore.htmlCode}
</body>
</html>`;

    const blob = new Blob([fullHtmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code.html';
    
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }

  return {
    getCodeFromUrl,
    loadEditorFromUrl,
    shareCode,
    shareOutput,
    updateUrlWithCode,
    debouncedUpdateUrl,
    shareButtonText,
    updateOutput,
    switchToOutput,
    switchToEditor,
    runCode,
    saveCode
  }
}