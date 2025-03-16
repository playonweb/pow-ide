<template>
  <div>
    <div v-if="isDialogVisible"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 dark:bg-black dark:bg-opacity-50"
      @click.self="closeDialog">
      <div class="bg-white rounded-3xl p-6 w-80 flex flex-col items-center shadow-3xl dark:bg-gray-800">
        <img :src="qrCode" alt="QR Code" v-if="qrCode" class="w-full h-auto" />
        <h3 class="text-lg font-semibold mt-2" contenteditable="true">Edit caption...</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
const { qrCode } = useQr();
const isDialogVisible = ref(false);

watch(qrCode, (newQrCode) => {
  if (newQrCode) {
    isDialogVisible.value = true;
  }
});

const closeDialog = () => {
  isDialogVisible.value = false;
};
</script>

<style scoped>
</style>
