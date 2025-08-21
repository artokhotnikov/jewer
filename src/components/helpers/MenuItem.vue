<script setup lang="ts">
import { ref } from 'vue'
import type { MediaFile } from '@/stores/fsMedia.ts'

defineProps<{
  menuItems: MediaFile[] | undefined
}>()

const emit = defineEmits<{
  (e: 'click', item: MediaFile): void
}>()

const animatingItemId = ref<string | null>(null)
const isAnimating = ref(false)

const handleClick = async (item: MediaFile) => {
  if (isAnimating.value) return

  isAnimating.value = true
  animatingItemId.value = item.id

  await new Promise((resolve) => {
    setTimeout(resolve, 800)
  })

  emit('click', item)
}
</script>

<template>
  <transition-group name="menu">
    <div
      v-for="(item, i) in menuItems"
      :key="item.id"
      class="menu-item"
      :class="{ animating: animatingItemId === item.id }"
      :style="{ '--i': i }"
      @click="handleClick(item)"
    >
      <img :src="item.url" alt="" />

      <span>{{ item.nameClear }}</span>
    </div>
  </transition-group>
</template>

<style scoped>
.menu-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 980px;
  border-radius: 72px;
  overflow: hidden;
  will-change: transform, opacity;
  cursor: pointer;
  transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  height: 100%;

  &.animating {
    img {
      transform: scale(1.3);
    }

    span {
      transform: scale(0.8);
      opacity: 0.8;
    }
  }

  img {
    position: absolute;
    object-fit: cover;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  }

  span {
    position: absolute;
    font-size: 120px;
    font-weight: 600;
    color: var(--color-white);
    transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
    z-index: 1;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    text-wrap: balance;
  }
}
</style>
