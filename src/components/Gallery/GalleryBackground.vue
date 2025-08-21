<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const gallery = route.params.name as string
</script>

<template>
  <div v-if="gallery === 'Музыка'" class="item">
    <img src="@/assets/icons/music.svg" alt="" />

    <img src="@/assets/icons/music-2.svg" alt="" />
  </div>

  <div v-if="gallery === 'Искусство'" class="item">
    <img src="@/assets/icons/issk.svg" alt="" />

    <img src="@/assets/icons/issk-2.svg" alt="" />
  </div>

  <div v-if="gallery === 'Культура'" class="item">
    <img src="@/assets/icons/cult.svg" alt="" />

    <img src="@/assets/icons/cult-2.svg" alt="" />
  </div>

  <div v-if="gallery === 'Менора'" class="item">
    <img src="@/assets/icons/menora.svg" alt="" />

    <img src="@/assets/icons/menora-2.svg" alt="" />
  </div>
</template>

<style scoped>
.item {
  img:nth-child(1) {
    position: absolute;
    bottom: 80px;
    left: 50px;
    z-index: 1;
  }

  img:nth-child(2) {
    position: absolute;
    bottom: 130px;
    right: 80px;
    z-index: 1;
  }
}
</style>
