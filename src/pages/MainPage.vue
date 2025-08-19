<script setup lang="ts">
import { useFsMediaStore, type MediaFile } from '@/stores/fsMedia.ts'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import EmptyBlock from '@/components/helpers/EmptyBlock.vue'

const DIR_NAME = 'Меню'

const fs = useFsMediaStore()
const router = useRouter()

const menuItems = computed(() => fs.byDir.get(DIR_NAME))
const hasMenuItems = computed(() => Array.isArray(menuItems.value) && menuItems.value.length > 0)

const animatingItemId = ref<string | null>(null)
const isAnimating = ref(false)

const handleClick = async (item: MediaFile) => {
  if (isAnimating.value) return

  isAnimating.value = true
  animatingItemId.value = item.id

  await new Promise((resolve) => {
    setTimeout(resolve, 800)
  })

  router.push(`/gallery/${item.nameClear}`)
}
</script>

<template>
  <div class="menu">
    <transition-group v-if="hasMenuItems" name="menu" tag="div" class="menu-list" appear>
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

    <empty-block v-else title="Меню не заполнено" />
  </div>
</template>

<style scoped>
.menu-list {
  padding: 80px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
}

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
  }
}
</style>
