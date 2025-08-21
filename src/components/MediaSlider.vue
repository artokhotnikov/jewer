<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MediaFile } from '@/stores/fsMedia'
import VideoPlayer from './VideoPlayer.vue'

const props = defineProps<{
  items: MediaFile[]
}>()

const emit = defineEmits<{
  slideChange: [index: number, item: MediaFile]
}>()

const currentIndex = ref(0)
const slideDirection = ref<'next' | 'prev'>('next')

const currentItem = computed(() => props.items[currentIndex.value] || props.items[0])

const goToSlide = (index: number, direction: 'next' | 'prev') => {
  if (index >= 0 && index < props.items.length) {
    slideDirection.value = direction
    currentIndex.value = index
    emit('slideChange', index, props.items[index])
  }
}

const goNext = () => {
  if (currentIndex.value < props.items.length - 1) {
    goToSlide(currentIndex.value + 1, 'next')
  } else if (props.items.length > 1) {
    goToSlide(0, 'next')
  }
}

const goPrev = () => {
  if (currentIndex.value > 0) {
    goToSlide(currentIndex.value - 1, 'prev')
  } else if (props.items.length > 1) {
    goToSlide(props.items.length - 1, 'prev')
  }
}
</script>

<template>
  <div class="slider">
    <div class="slider-container">
      <transition :name="slideDirection === 'next' ? 'slide-next' : 'slide-prev'" mode="out-in">
        <div :key="currentItem.id" class="slide-item">
          <img
            v-if="currentItem.kind === 'image'"
            :src="currentItem.url"
            :alt="currentItem.nameClear"
            class="media-content"
          />

          <video-player
            v-else-if="currentItem.kind === 'video'"
            :src="currentItem.url"
            class="media-content"
          />

          <div v-else-if="currentItem.kind === 'audio'" class="audio-container">
            <audio :src="currentItem.url" :controls="true" class="audio-player" />
          </div>
        </div>
      </transition>
    </div>

    <div class="navigation">
      <button class="nav-btn prev-btn" @click="goPrev" :disabled="currentIndex === 0">
        <img src="@/assets/icons/prev.svg" alt="" />
      </button>

      <button
        class="nav-btn next-btn"
        @click="goNext"
        :disabled="currentIndex === items.length - 1"
      >
        <img src="@/assets/icons/next.svg" alt="" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.slider {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 80px;
}

.slider-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
}

.slide-item {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform, opacity;
  width: 3256px;
  height: 1832px;
  border-radius: 72px;
  overflow: hidden;
}

.media-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.audio-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.audio-player {
  width: 300px;
}

.navigation {
  position: absolute;
  top: 50%;
  left: 80px;
  right: 80px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
}

.nav-btn {
  width: 128px;
  height: 128px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.nav-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.slide-next-enter-active,
.slide-next-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform, opacity;
}

.slide-next-enter-from {
  transform: translateX(100%) scale(0.95);
  opacity: 0;
}

.slide-next-leave-to {
  transform: translateX(-100%) scale(0.95);
  opacity: 0;
}

.slide-next-enter-to,
.slide-next-leave-from {
  transform: translateX(0) scale(1);
  opacity: 1;
}

.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform, opacity;
}

.slide-prev-enter-from {
  transform: translateX(-100%) scale(0.95);
  opacity: 0;
}

.slide-prev-leave-to {
  transform: translateX(100%) scale(0.95);
  opacity: 0;
}

.slide-prev-enter-to,
.slide-prev-leave-from {
  transform: translateX(0) scale(1);
  opacity: 1;
}

.slide-item {
  backface-visibility: hidden;
  perspective: 1000px;
  transform-style: preserve-3d;
}
</style>
