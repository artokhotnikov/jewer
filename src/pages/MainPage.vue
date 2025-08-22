<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import EmptyBlock from '@/components/helpers/EmptyBlock.vue'
import MenuItem from '@/components/helpers/MenuItem.vue'

import { useFsMediaStore, type MediaFile } from '@/stores/fsMedia.ts'
import { useWebSocketStore } from '@/stores/websocket.ts'

const DIR_NAME = 'Меню'

const fs = useFsMediaStore()
const router = useRouter()
const websocket = useWebSocketStore()

const menuItems = computed(() => fs.byDir.get(DIR_NAME))
const hasMenuItems = computed(() => Array.isArray(menuItems.value) && menuItems.value.length > 0)

const handleClick = (item: MediaFile) => {
  websocket.sendText(item.nameClear)

  router.push(`/text/${item.nameClear}`)
}
</script>

<template>
  <div class="menu-list">
    <menu-item v-if="hasMenuItems" :menu-items="menuItems" @click="handleClick" />

    <empty-block v-else title="Меню не заполнено" />
  </div>
</template>

<style scoped>
.menu-list {
  padding: 40px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  height: 100vh;
}
</style>
