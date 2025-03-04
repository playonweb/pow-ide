<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'nuxt/app'
import { useEditorStore } from '~/stores/editor'
import Welcome from '~/components/Welcome.vue'

// Disable layout to avoid wrapping
definePageMeta({
  layout: false,
})

// Access the route and editor store
const route = useRoute()
const editorStore = useEditorStore()

onMounted(() => {
  // Check query params
  const code = route.query.code
  const run = route.query.run === 'true'

  // If no code or run=true, don’t update DOM (Welcome component will show)
  if (code || run) {
    updateDOM()
  }
})

function updateDOM() {
  const code = route.query.code
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    document.open()
    document.write(code ? decodeURIComponent(code) : editorStore.htmlCode)
    document.close()
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.open()
      document.write(code ? decodeURIComponent(code) : editorStore.htmlCode)
      document.close()
    }, { once: true })
  }
}
</script>

<template>
  <!-- Show Welcome if no code or run query params -->
  <Welcome v-if="!route.query.code && route.query.run !== 'true'" />
</template>