<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <button class="back-button" @click="router.back()">
    <img src="@/assets/icons/arrow.svg" alt="" />
    Назад
  </button>
</template>

<style scoped>
.back-button {
  position: absolute;
  width: 550px;
  height: 160px;
  border-radius: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  font-size: 48px;
  font-weight: 600;
  color: var(--color-black);
  left: 80px;
  bottom: 80px;
  z-index: 100;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 32px 0 rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.4);
}
</style>
