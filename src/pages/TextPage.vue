<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useFsMediaStore } from '@/stores/fsMedia.ts'

import BackButton from '@/components/ui/BackButton.vue'
import AudioPlayer from '@/components/AudioPlayer.vue'

const fs = useFsMediaStore()

const params = useRoute().params
const fileName = params.name as string

const json = computed(() => fs.jsons.find((item) => item.nameClear === fileName))
const audio = computed(() => fs.audios.find((item) => item.nameClear === fileName))
</script>

<template>
  <div class="content">
    <div v-html="json?.content.content" class="content-text" />

    <back-button />

    <audio-player v-if="audio" :audio-src="audio.url" class="audio-player-container" />
  </div>
</template>

<style scoped>
.content {
  background-color: var(--color-gray);
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  padding: 40px;
}

.content-text {
  width: 100%;
  position: relative;
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.8);
  border-radius: 40px;
  padding: 40px;
  max-height: 916px;
  overflow: auto;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  h1 {
    font-weight: 600;
    font-size: 40px;
    margin: 0 0 20px;
  }
}

.audio-player-container {
  width: 980px;
  position: absolute;
  bottom: 80px;
  right: 80px;
}
</style>
