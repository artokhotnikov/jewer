<script setup lang="ts">
interface Props {
  title?: string
}

const { title = 'Ничего не найдено' } = defineProps<Props>()
</script>

<template>
  <div class="block">
    <div class="block-title">
      {{ title }}
    </div>
  </div>
</template>

<style scoped>
.block {
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;
  font-size: 64px;
  padding: 80px;
}
</style>
