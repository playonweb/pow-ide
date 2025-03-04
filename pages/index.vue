<script setup>
const colorMode = useColorMode()
</script>

<template>
    <div>
        <p class="p-4 pb-2 flex justify-end">
            <select v-model="colorMode.preference"
                class="border w-24 h-8 dark:bg-gray-900 dark:text-white dark:border-gray-700">
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </select>
        </p>
        <div class="flex justify-center">
            <div class="bg-gradient-to-r from-fuchsia-500 to-cyan-500 dark:bg-black w-100 m-4 p-10 rounded-3xl">
                <h1 class="text-3xl text-center text-white font-bold underline hover:text-pink-200 cursor-pointer">
                    <NuxtLink to="/editor">Open Online HTML Editor</NuxtLink>
                </h1>
            </div>
        </div>
    </div>
</template>
