import { useMagicKeys } from '@vueuse/core';

export default defineNuxtPlugin(() => {
  const { ctrl, d } = useMagicKeys(); // Monitor only the keys you need

  const handleKeydown = (event) => {
    if (ctrl.value && d.value) {
      event.preventDefault(); // Block default behavior
      const colorMode = useColorMode()
      colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
    }
  };

  // Add event listener when the plugin is initialized
  window.addEventListener('keydown', handleKeydown);
});
