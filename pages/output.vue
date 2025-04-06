<script setup>
import { useEditorStore } from '~/stores/editor'
import Welcome from '~/components/Welcome.vue'

const layout = useState('layout');

onBeforeMount(() => {
  layout.value = 'blank';
})

const { getCodeFromUrl } = useEditor()

// Disable layout to avoid wrapping
definePageMeta({
  layout: false,
})

const route = useRoute()
const editorStore = useEditorStore()
const code = ref(null)
const run = ref(false)

onBeforeMount(async () => {
  code.value = await getCodeFromUrl()
  run.value = route.query.run === 'true'
  if (code.value || run.value) {
    updateDOM()
  }
})

async function updateDOM() {
  const htmlContent = code.value || editorStore.htmlCode

  // Parse the HTML content to extract title and favicon
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, 'text/html')
  const titleTag = doc.querySelector('title')
  const faviconTag = doc.querySelector('link[rel="icon"]') || doc.querySelector('link[rel="shortcut icon"]')

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    document.open()
    document.write(htmlContent)
    document.close()

    // Set document title if a <title> tag exists
    if (titleTag?.textContent) {
      document.title = titleTag.textContent
    }

    // Append favicon to head if it exists
    if (faviconTag) {
      const existingFavicon = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]')
      if (existingFavicon) {
        existingFavicon.remove()
      }
      document.head.appendChild(faviconTag.cloneNode())
    }
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.open()
      document.write(htmlContent)
      document.close()

      if (titleTag?.textContent) {
        document.title = titleTag.textContent
      }

      if (faviconTag) {
        const existingFavicon = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]')
        if (existingFavicon) {
          existingFavicon.remove()
        }
        document.head.appendChild(faviconTag.cloneNode())
      }
    }, { once: true })
  }
}
</script>

<template>
  <div>
    <ClientOnly>
        <Welcome v-if="!code && !run" />
    </ClientOnly>
  </div>
</template>