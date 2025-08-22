<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { useWebSocketStore, type WebSocketMessage } from '@/stores/websocket.ts'
import { useFsMediaStore, type MediaFile } from '@/stores/fsMedia.ts'

const fs = useFsMediaStore()
const websocket = useWebSocketStore()

const videoItem = ref<MediaFile | null>(null)

const videoUrl = computed(() => {
  return videoItem.value?.url || '/public/files/Контент/screen.webm'
})

const handleNewMessage = (message: WebSocketMessage) => {
  switch (message.data.type) {
    case 'broadcast':
      const name = message.data.originalData

      videoItem.value = fs.videos.find((item) => item.nameClear === name) || null

      break
    default:
      console.log('Получено сообщение:', message.data.originalData)
  }
}

watch(
  () => websocket.messages,
  (newMessages) => {
    const newMessage = newMessages[newMessages.length - 1]

    handleNewMessage(newMessage)
  },
  { deep: true },
)
</script>

<template>
  <div class="screen">
    <video :src="videoUrl" autoplay muted loop />
  </div>
</template>

<style scoped>
.screen {
  width: 100vw;
  height: 100vh;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
