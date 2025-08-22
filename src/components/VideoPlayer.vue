<script setup lang="ts">
import { ref, onUnmounted, onMounted, watch } from 'vue'

interface Props {
  src: string
}

const props = defineProps<Props>()

watch(
  () => props.src,
  (newSrc, oldSrc) => {
    if (newSrc !== oldSrc) {
      duration.value = 0
      currentTime.value = 0
      stopDurationCheck()
      startDurationCheck()
    }
  },
)

const videoRef = ref<HTMLVideoElement>()
const volumeSlider = ref<HTMLElement>()
const progressSlider = ref<HTMLElement>()
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

const updateVolumeClick = (event: MouseEvent) => {
  if (volumeSlider.value && videoRef.value) {
    const rect = volumeSlider.value.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const percent = clickX / rect.width
    const newVolume = Math.max(0, Math.min(1, percent))

    volume.value = newVolume
    videoRef.value.volume = newVolume

    if (newVolume === 0) {
      isMuted.value = true
    } else if (isMuted.value) {
      isMuted.value = false
    }
  }
}

const seekToClick = (event: MouseEvent) => {
  if (progressSlider.value && videoRef.value) {
    const rect = progressSlider.value.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const percent = clickX / rect.width
    const seekTime = percent * duration.value

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

const onCanPlay = () => {
  if (videoRef.value && duration.value === 0) {
    duration.value = videoRef.value.duration
  }
}

const onLoadedData = () => {
  if (videoRef.value && duration.value === 0) {
    duration.value = videoRef.value.duration
  }
}

const checkDuration = () => {
  if (videoRef.value && duration.value === 0 && videoRef.value.duration > 0) {
    duration.value = videoRef.value.duration
  }
}

let durationCheckInterval: number | null = null

const startDurationCheck = () => {
  if (durationCheckInterval) return

  durationCheckInterval = setInterval(() => {
    if (duration.value > 0) {
      clearInterval(durationCheckInterval!)
      durationCheckInterval = null
      return
    }
    checkDuration()
  }, 100)
}

const stopDurationCheck = () => {
  if (durationCheckInterval) {
    clearInterval(durationCheckInterval)
    durationCheckInterval = null
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

onMounted(() => {
  startDurationCheck()
})

onUnmounted(() => {
  stopDurationCheck()

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
      @canplay="onCanPlay"
      @loadeddata="onLoadedData"
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
          <div class="volume-slider" @click="updateVolumeClick" ref="volumeSlider">
            <div class="volume-track">
              <div class="volume-fill" :style="{ width: volume * 100 + '%' }"></div>
            </div>
          </div>
        </div>

        <div class="time-display">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</div>
      </div>

      <div class="progress-bar">
        <button class="control-btn play-btn" @click="togglePlay">
          <img v-if="isPlaying" src="@/assets/icons/pause.svg" alt="" />

          <img v-else src="@/assets/icons/play.svg" alt="" />
        </button>

        <div class="progress-slider" @click="seekToClick" ref="progressSlider">
          <div class="progress-track">
            <div
              class="progress-fill"
              :style="{ width: (currentTime / duration) * 100 + '%' }"
            ></div>
          </div>
        </div>
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
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.volume-track {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  position: relative;
}

.volume-fill {
  height: 100%;
  background: var(--color-white);
  border-radius: 12px;
  transition: width 0.1s ease;
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
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.progress-track {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: var(--color-white);
  border-radius: 12px;
  transition: width 0.1s ease;
}
</style>
