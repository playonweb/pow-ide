<script setup lang="ts">
import { ClientOnly } from '#components';

</script>

<template>
    <div>
        <h1 class="text-3xl font-bold text-center md:text-4xl"
        >Brotli Text Compression Tool</h1>
        <p class="text-lg text-center text-gray-600 dark:text-gray-400">
            Compress and decompress text online using the Brotli algorithm. Fast, efficient, and easy-to-use tool for text compression.
        </p>
        <div>
            <ClientOnly>
                <BrotliDemo />
            </ClientOnly>
        </div>
    </div>
</template>