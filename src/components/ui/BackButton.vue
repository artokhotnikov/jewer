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
  width: 420px;
  height: 128px;
  border-radius: 64px;
  background-color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  font-size: 40px;
  font-weight: 600;
  color: var(--color-black);
  left: 292px;
  bottom: 80px;
  z-index: 100;
}
</style>
