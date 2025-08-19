<script setup lang="ts">
import { useFsMediaStore } from '@/stores/fsMedia.ts'

const fs = useFsMediaStore()
</script>

<template>
  <div class="wrapper">
    <h1>Для продолжения работы выберите папку с файлами</h1>

    <button @click="fs.pickDirectory">Выбрать</button>
  </div>
</template>

<style scoped>
.wrapper {
  position: fixed;
  inset: 0;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 10000;
}

h1 {
  font-size: 170px;
  font-weight: 700;
  margin: 0 0 64px;
  text-align: center;
  text-wrap: balance;
}

button {
  padding: 40px 50px;
  border-radius: 10px;
  background: #000;
  color: #fff;
  font-size: 32px;
}
</style>
