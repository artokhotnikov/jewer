<script setup lang="ts">
const handleClick = () => {
  console.log('тут со Степой действия')
}
</script>

<template>
  <button class="smoke-button" @click="handleClick">Запустить пар</button>
</template>

<style scoped>
.smoke-button {
  color: var(--color-white);
  backdrop-filter: blur(10px);
  background: rgba(61, 71, 52, 0.7);
  font-weight: 600;
  font-size: 40px;
  position: absolute;
  width: 420px;
  height: 128px;
  border-radius: 64px;
  position: absolute;
  left: 752px;
  bottom: 80px;
}
</style>
