<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFsMediaStore } from '@/stores/fsMedia.ts'

const DIR_NAME = 'Меню'

const fs = useFsMediaStore()
const router = useRouter()

const menuItem = computed(() => fs.byDir.get(DIR_NAME)?.[0])

const handleClick = () => {
  router.push(`/gallery`)
}
</script>

<template>
  <div class="menu">
    <img v-if="menuItem" :src="menuItem.url" class="menu-bg" />

    <div class="btn" @click="handleClick">Нажмите, чтобы начать</div>
  </div>
</template>

<style scoped>
.menu {
  background-color: var(--color-gray);
  width: 100vq;
  height: 100vh;
  position: relative;
}

.menu-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.btn {
  border-radius: 108px;
  padding: 48px 64px;
  backdrop-filter: blur(50px);
  background: rgba(255, 255, 255, 0.8);
  width: 1664px;
  height: 216px;
  font-weight: 600;
  font-size: 64px;
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
