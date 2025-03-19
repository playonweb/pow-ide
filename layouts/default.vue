<script setup>
useHead({
  link: [
    {
      rel: "icon",
      type: "image/x-icon",
      href: "https://playonweb.org/favicon.ico",
    },
  ],
});
</script>
<template>
    <div>
      <ClientOnly>
        <slot></slot>
      </ClientOnly>
    </div>
</template>

<style lang="postcss">
body {
  @apply min-h-screen bg-white dark:bg-gray-800 dark:text-gray-200;
}
</style>
