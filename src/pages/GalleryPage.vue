<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useFsMediaStore, type MediaFile } from '@/stores/fsMedia.ts'

import EmptyBlock from '@/components/helpers/EmptyBlock.vue'
import BackButton from '@/components/ui/BackButton.vue'
import MediaSlider from '@/components/MediaSlider.vue'

const fs = useFsMediaStore()

const params = useRoute().params
const galleryName = params.name as string
const emptyTitle = `Галерея ${galleryName} не заполнена`

const gallery = computed(() => fs.byDir.get(galleryName) || [])
const hasGallery = computed(() => Array.isArray(gallery.value) && gallery.value.length > 0)

const handleSlideChange = (index: number, item: MediaFile) => {
  console.log(`Переключился на слайд ${index + 1}:`, item.name)
}
</script>

<template>
  <div class="gallery">
    <div v-if="hasGallery" class="gallery-content">
      <media-slider :items="gallery" @slide-change="handleSlideChange" />
    </div>

    <empty-block v-else :title="emptyTitle" />

    <back-button />
  </div>
</template>

<style scoped>
.gallery {
  background-color: var(--color-gray);
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.gallery-content {
  width: 100%;
  height: 100%;
  position: relative;
}

.slider-toggle {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}

.toggle-btn {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.toggle-btn:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: translateY(-2px);
}

.toggle-btn.active {
  background: rgba(102, 126, 234, 0.8);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}
</style>
