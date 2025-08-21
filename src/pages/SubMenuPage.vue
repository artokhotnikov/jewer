<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFsMediaStore, type MediaFile } from '@/stores/fsMedia.ts'

import EmptyBlock from '@/components/helpers/EmptyBlock.vue'
import BackButton from '@/components/ui/BackButton.vue'

const fs = useFsMediaStore()
const router = useRouter()

const params = useRoute().params
const submenuName = params.name as string
const emptyTitle = `Меню ${submenuName} не заполнено`

const menu = computed(() => fs.byDir.get(submenuName)?.filter((item) => item.ext === 'json') || [])
const hasMenu = computed(() => Array.isArray(menu.value) && menu.value.length > 0)

const currentPage = ref(0)
const itemsPerPage = 12
const totalPages = computed(() => Math.ceil(menu.value.length / itemsPerPage))
const showSlider = computed(() => menu.value.length > itemsPerPage)

const currentItems = computed(() => {
  if (!showSlider.value) return menu.value
  const start = currentPage.value * itemsPerPage
  const end = start + itemsPerPage
  return menu.value.slice(start, end)
})

const goToNext = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
  }
}

const goToPrev = () => {
  if (currentPage.value > 0) {
    currentPage.value--
  }
}

const handleClick = (item: MediaFile) => {
  router.push(`/text/${item.nameClear}`)
}
</script>

<template>
  <div class="menu">
    <div v-if="hasMenu" class="menu-list" :class="{ 'menu-list--slider': showSlider }">
      <transition name="fade" mode="out-in">
        <div :key="currentPage" class="menu-items-container">
          <div
            v-for="item in currentItems"
            :key="item.id"
            class="menu-item"
            @click="handleClick(item)"
          >
            <span>{{ item.nameClear }}</span>
          </div>
        </div>
      </transition>
    </div>

    <empty-block v-else :title="emptyTitle" />

    <back-button />

    <div v-if="showSlider" class="menu-controls">
      <div
        class="menu-controls-prev"
        :class="{ 'menu-controls-prev--disabled': currentPage === 0 }"
        @click="goToPrev"
      >
        <img src="@/assets/icons/prev.svg" alt="" />
      </div>

      <div
        class="menu-controls-next"
        :class="{ 'menu-controls-next--disabled': currentPage === totalPages - 1 }"
        @click="goToNext"
      >
        <img src="@/assets/icons/next.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu {
  background-color: var(--color-gray);
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  padding: 80px;
}

.menu-list {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  max-height: 3500px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.menu-list--slider {
  overflow: visible;
}

.menu-items-container {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  width: 100%;
}

.menu-item {
  backdrop-filter: blur(160px);
  background: rgba(255, 255, 255, 0.8);
  border-radius: 72px;
  padding: 48px;
  font-weight: 600;
  font-size: 54px;
  text-align: center;
  color: #3d4734;
  display: flex;
  align-items: center;
  justify-content: center;
  text-wrap: balance;
  height: 550px;
  flex-grow: 1;
  max-width: 50%;
  transition: transform 0.3s ease;
}

.menu-controls {
  position: absolute;
  bottom: 80px;
  right: 80px;
  display: flex;
  align-items: center;
  gap: 40px;
}

.menu-controls-prev,
.menu-controls-next {
  cursor: pointer;
}

.menu-controls-prev--disabled,
.menu-controls-next--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
