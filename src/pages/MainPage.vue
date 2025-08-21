<script setup lang="ts">
import { useFsMediaStore, type MediaFile } from '@/stores/fsMedia.ts'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import EmptyBlock from '@/components/helpers/EmptyBlock.vue'
import MenuItem from '@/components/helpers/MenuItem.vue'

const DIR_NAME = 'Меню'
const HAS_SUBMENU_PAGES = ['Словарь']

const fs = useFsMediaStore()
const router = useRouter()

const menuItems = computed(() => fs.byDir.get(DIR_NAME))
const hasMenuItems = computed(() => Array.isArray(menuItems.value) && menuItems.value.length > 0)

const handleClick = (item: MediaFile) => {
  if (HAS_SUBMENU_PAGES.includes(item.nameClear)) {
    router.push(`/menu/${item.nameClear}`)
  } else {
    router.push(`/gallery/${item.nameClear}`)
  }
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
  padding: 80px;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 40px;
  height: 100vh;
}
</style>
