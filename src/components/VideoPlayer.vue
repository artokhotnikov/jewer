<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

interface Props {
  src: string
}

defineProps<Props>()

const videoRef = ref<HTMLVideoElement>()
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const isMuted = ref(false)

const togglePlay = () => {
  if (videoRef.value) {
    if (isPlaying.value) {
      videoRef.value.pause()
    } else {
      videoRef.value.play()
    }
    isPlaying.value = !isPlaying.value
  }
}

const toggleMute = () => {
  if (videoRef.value) {
    isMuted.value = !isMuted.value
    videoRef.value.muted = isMuted.value
  }
}

const updateVolume = (event: Event) => {
  const target = event.target as HTMLInputElement
  const newVolume = parseFloat(target.value)
  volume.value = newVolume
  if (videoRef.value) {
    videoRef.value.volume = newVolume
    if (newVolume === 0) {
      isMuted.value = true
    } else if (isMuted.value) {
      isMuted.value = false
    }
  }
}

const seekTo = (event: Event) => {
  const target = event.target as HTMLInputElement
  const seekTime = parseFloat(target.value)
  if (videoRef.value) {
    videoRef.value.currentTime = seekTime
    currentTime.value = seekTime
  }
}

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const onTimeUpdate = () => {
  if (videoRef.value) {
    currentTime.value = videoRef.value.currentTime
  }
}

const onLoadedMetadata = () => {
  if (videoRef.value) {
    duration.value = videoRef.value.duration
  }
}

const onPlay = () => {
  isPlaying.value = true
}

const onPause = () => {
  isPlaying.value = false
}

const onEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
}

onUnmounted(() => {
  if (videoRef.value) {
    videoRef.value.pause()
  }
})
</script>

<template>
  <div class="video-container">
    <video
      ref="videoRef"
      :src="src"
      class="media-content"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
    />

    <div class="video-controls">
      <div class="controls-top">
        <button class="control-btn mute-btn" @click="toggleMute">
          <img v-if="isMuted" src="@/assets/icons/mute.svg" alt="" />

          <img v-else-if="!isMuted && volume < 0.5" src="@/assets/icons/sound-small.svg" alt="" />

          <img v-else src="@/assets/icons/sound.svg" alt="" />
        </button>

        <div class="volume-control">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            :value="volume"
            @input="updateVolume"
            class="volume-slider"
          />
        </div>

        <div class="time-display">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</div>
      </div>

      <div class="progress-bar">
        <button class="control-btn play-btn" @click="togglePlay">
          <img v-if="isPlaying" src="@/assets/icons/pause.svg" alt="" />

          <img v-else src="@/assets/icons/play.svg" alt="" />
        </button>

        <input
          type="range"
          min="0"
          :max="duration"
          step="0.1"
          :value="currentTime"
          @input="seekTo"
          class="progress-slider"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.video-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.media-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.video-controls {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 48px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 20;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6) 20%, rgba(0, 0, 0, 0.1) 100%);
}

.controls-top {
  display: flex;
  align-items: center;
  gap: 15px;
}

.control-btn {
  background: none;
  border: none;
  color: var(--color-white);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.volume-slider {
  width: 450px;
  height: 12px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 32px;
  height: 32px;
  background: var(--color-white);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.time-display {
  color: var(--color-white);
  font-weight: 600;
  font-size: 48px;
  text-align: center;
  margin-left: auto;
}

.progress-bar {
  display: flex;
  align-items: center;
  gap: 48px;
}

.progress-slider {
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;
}

.progress-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 32px;
  height: 32px;
  background: var(--color-white);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}
</style>
