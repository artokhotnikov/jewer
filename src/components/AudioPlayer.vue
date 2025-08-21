<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  audioSrc: string
  autoPlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoPlay: false,
})

const audio = ref<HTMLAudioElement | null>(null)
const progressBar = ref<HTMLElement | null>(null)
const volumeSlider = ref<HTMLElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref('0:00')
const duration = ref('0:00')
const progressPercent = ref(0)
const volumePercent = ref(100)
const showVolumeSlider = ref(false)

onMounted(() => {
  audio.value = new Audio(props.audioSrc)

  audio.value.addEventListener('loadedmetadata', () => {
    duration.value = formatTime(audio.value!.duration)
  })

  audio.value.addEventListener('timeupdate', () => {
    if (audio.value) {
      currentTime.value = formatTime(audio.value.currentTime)
      progressPercent.value = (audio.value.currentTime / audio.value.duration) * 100
    }
  })

  audio.value.addEventListener('ended', () => {
    isPlaying.value = false
    progressPercent.value = 0
    currentTime.value = '0:00'
    showVolumeSlider.value = false
  })

  if (props.autoPlay) {
    playAudio()
  }
})

onUnmounted(() => {
  if (audio.value) {
    audio.value.pause()
    audio.value = null
  }
})

const playAudio = () => {
  if (audio.value) {
    audio.value.play()
    isPlaying.value = true
  }
}

const pauseAudio = () => {
  if (audio.value) {
    audio.value.pause()
    isPlaying.value = false
    showVolumeSlider.value = false
  }
}

const seekAudio = (event: MouseEvent) => {
  if (progressBar.value && audio.value) {
    const rect = progressBar.value.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const percent = (clickX / rect.width) * 100
    audio.value.currentTime = (audio.value.duration / 100) * percent
  }
}

const setVolume = (event: MouseEvent) => {
  if (volumeSlider.value && audio.value) {
    const rect = volumeSlider.value.getBoundingClientRect()
    const clickY = event.clientY - rect.top
    const height = rect.height
    const percent = 100 - (clickY / height) * 100
    const clampedPercent = Math.max(0, Math.min(100, percent))

    volumePercent.value = clampedPercent
    audio.value.volume = clampedPercent / 100
  }
}

const toggleVolumeSlider = () => {
  showVolumeSlider.value = !showVolumeSlider.value
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="audio-player">
    <div v-if="!isPlaying" class="play-button" @click="playAudio">
      <img src="@/assets/icons/play-a.svg" alt="Play" class="play-icon" />

      <span class="play-text">Прослушать аудио</span>
    </div>

    <div v-else class="control-panel">
      <div class="control-buttons">
        <div class="pause-button" @click="pauseAudio">
          <img src="@/assets/icons/pause-a.svg" alt="Pause" class="pause-icon" />
        </div>

        <div class="volume-control">
          <img
            v-if="volumePercent > 50"
            src="@/assets/icons/sound-a.svg"
            class="volume-icon"
            @click="toggleVolumeSlider"
          />
          <img
            v-if="volumePercent < 50"
            src="@/assets/icons/sound-small-a.svg"
            class="volume-icon"
            @click="toggleVolumeSlider"
          />
          <img
            v-if="volumePercent === 0"
            src="@/assets/icons/sound-a.svg"
            class="volume-icon"
            @click="toggleVolumeSlider"
          />
        </div>

        <div
          v-if="showVolumeSlider"
          class="volume-slider-overlay"
          @click="setVolume"
          ref="volumeSlider"
        >
          <div class="volume-track">
            <div class="volume-fill" :style="{ height: volumePercent + '%' }"></div>
          </div>
        </div>
      </div>

      <div class="progress-container">
        <div class="progress-bar" @click="seekAudio" ref="progressBar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.audio-player {
  height: 128px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 64px;
  padding: 32px 48px;
  display: flex;
  align-items: center;
}
.play-button {
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
}

.play-icon {
  width: 64px;
  height: 64px;
}

.play-text {
  font-weight: 600;
  font-size: 40px;
}

.control-panel {
  display: flex;
  align-items: center;
  gap: 24px;
  width: 100%;
}

.control-buttons {
  display: flex;
  align-items: center;
  gap: 20px;
}

.pause-icon,
.volume-icon {
  width: 64px;
  height: 64px;
}

.volume-icon {
  width: 64px;
  height: 64px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.progress-container {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
}

.progress-bar {
  flex: 1;
  height: 24px;
  background: rgba(61, 71, 52, 0.4);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: #3d4734;
  border-radius: 12px;
  transition: width 0.1s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background: #3d4734;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
}

.volume-slider {
  width: 24px;
  height: 80px;
  cursor: pointer;
  position: relative;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.volume-track {
  width: 100%;
  height: 100%;
  background: rgba(61, 71, 52, 0.4);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.volume-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #3d4734;
  border-radius: 12px;
  transition: height 0.1s ease;
}

.volume-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  background: #3d4734;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.volume-slider-overlay {
  position: absolute;
  bottom: 100%;
  left: 140px;
  width: 24px;
  height: 280px;
  cursor: pointer;
  margin-bottom: 16px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
