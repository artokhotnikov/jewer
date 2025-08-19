<script setup lang="ts">
import { ref } from 'vue'
import { useFsMediaStore } from '@/stores/fsMedia.ts'

const fs = useFsMediaStore()

const time = ref(0)
const handleClick = () => {
  time.value++

  if (time.value === window.TIMES_TO_RESET) {
    time.value = 0

    fs.revokeAccess()
  }
}
</script>

<template>
  <div @click="handleClick" class="handler" />
</template>

<style scoped>
.handler {
  position: fixed;
  top: 0;
  left: 0;
  width: 200px;
  height: 200px;
}
</style>
