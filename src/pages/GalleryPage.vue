<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useFsMediaStore } from '@/stores/fsMedia.ts'

import EmptyBlock from '@/components/helpers/EmptyBlock.vue'
import BackButton from '@/components/ui/BackButton.vue'

const fs = useFsMediaStore()

const params = useRoute().params
const galleryName = params.name as string
const emptyTitle = `Галерея ${galleryName} не заполнена`

const gallery = computed(() => fs.byDir.get(galleryName))
const hasGallery = computed(() => Array.isArray(gallery.value) && gallery.value.length > 0)
</script>

<template>
  <div class="gallery">
    <div v-if="hasGallery">
      <div>
        <div v-for="item in gallery" :key="item.id">
          <img :src="item.url" alt="" />
        </div>
      </div>
    </div>

    <empty-block v-else :title="emptyTitle" />

    <back-button />
  </div>
</template>

<style scoped>
.gallery {
  background-color: var(--color-gray);
  padding: 80px;
  position: relative;
  width: 100vw;
  height: 100vh;
}
</style>
