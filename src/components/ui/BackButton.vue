<script setup lang="ts">
import { useRouter } from 'vue-router'

import { useWebSocketStore } from '@/stores/websocket.ts'

const router = useRouter()
const websocket = useWebSocketStore()

const handleClick = () => {
  websocket.sendText('null')

  router.back()
}
</script>

<template>
  <button class="back-button" @click="handleClick">
    <img src="@/assets/icons/arrow.svg" alt="" />
    Назад
  </button>
</template>

<style scoped>
.back-button {
  position: absolute;
  border-radius: 32px;
  padding: 16px 24px;
  width: 240px;
  height: 64px;
  background-color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-black);
  left: 40px;
  bottom: 40px;
  z-index: 100;

  img {
    width: 32px;
  }
}
</style>
